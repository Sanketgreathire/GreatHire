import { Client } from '@elastic/elasticsearch';
import axios from 'axios';

// Elasticsearch client
const getElasticsearchClient = () => {
  return new Client({
    node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
    auth: {
      username: process.env.ELASTICSEARCH_USERNAME || 'elastic',
      password: process.env.ELASTICSEARCH_PASSWORD || 'changeme'
    }
  });
};

// Qdrant client
const getQdrantClient = () => {
  const QDRANT_URL = process.env.QDRANT_URL || 'http://localhost:6333';
  const QDRANT_API_KEY = process.env.QDRANT_API_KEY || '';
  
  return {
    url: QDRANT_URL,
    apiKey: QDRANT_API_KEY,
    headers: {
      'api-key': QDRANT_API_KEY,
      'Content-Type': 'application/json'
    }
  };
};

// Sync single graph record to Elasticsearch
export async function syncTalentGraphToElasticsearch(graphId, graphData) {
  try {
    const client = getElasticsearchClient();
    const indexName = 'talent-graph';
    
    const document = {
      id: graphData.id,
      type: graphData.type,
      nodes: graphData.nodes,
      edges: graphData.edges,
      metadata: graphData.metadata || {},
      graphMetadata: graphData.graphMetadata || {},
      scoring: graphData.scoring || {},
      lastUpdated: graphData.lastUpdated || new Date(),
      version: graphData.version || '1.0',
      isActive: graphData.isActive !== false
    };
    
    const response = await client.index({
      index: indexName,
      id: graphId,
      body: document,
      refresh: false
    });
    
    console.log(`Synced talent graph ${graphId} to Elasticsearch:`, response.result);
    return response;
  } catch (error) {
    console.error("Error syncing talent graph to Elasticsearch:", error);
    throw error;
  }
}

// Sync single graph record to Qdrant
export async function syncTalentGraphToQdrant(graphId, graphData) {
  try {
    const qdrant = getQdrantClient();
    const collectionName = 'talent-graph';
    
    // Create collection if it doesn't exist
    await ensureQdrantCollection(collectionName);
    
    // Generate vector embedding for graph data
    const embedding = await generateGraphEmbedding(graphData);
    
    const point = {
      id: graphId,
      vector: embedding,
      payload: {
        id: graphData.id,
        type: graphData.type,
        nodeCount: graphData.nodes?.length || 0,
        edgeCount: graphData.edges?.length || 0,
        density: graphData.graphMetadata?.density || 0,
        lastUpdated: graphData.lastUpdated || new Date(),
        version: graphData.version || '1.0',
        isActive: graphData.isActive !== false,
        // Include key metadata for filtering
        metadata: {
          nodeTypes: [...new Set(graphData.nodes?.map(n => n.type) || [])],
          edgeTypes: [...new Set(graphData.edges?.map(e => e.type) || [])],
          avgNodeScore: graphData.nodes?.reduce((sum, n) => sum + (n.score || 0), 0) / (graphData.nodes?.length || 1),
          avgEdgeStrength: graphData.edges?.reduce((sum, e) => sum + (e.strength || 0), 0) / (graphData.edges?.length || 1)
        }
      }
    };
    
    const response = await axios.post(
      `${qdrant.url}/collections/${collectionName}/points`,
      {
        points: [point]
      },
      {
        headers: qdrant.headers
      }
    );
    
    console.log(`Synced talent graph ${graphId} to Qdrant:`, response.status);
    return response.data;
  } catch (error) {
    console.error("Error syncing talent graph to Qdrant:", error);
    throw error;
  }
}

// Bulk sync graphs to Elasticsearch
export async function bulkSyncTalentGraphsToElasticsearch(graphs) {
  try {
    const client = getElasticsearchClient();
    const indexName = 'talent-graph';
    
    const body = [];
    
    graphs.forEach(graph => {
      body.push({
        index: { _index: indexName, _id: graph._id.toString() }
      });
      
      body.push({
        id: graph.id,
        type: graph.type,
        nodes: graph.nodes,
        edges: graph.edges,
        metadata: graph.metadata || {},
        graphMetadata: graph.graphMetadata || {},
        scoring: graph.scoring || {},
        lastUpdated: graph.lastUpdated || new Date(),
        version: graph.version || '1.0',
        isActive: graph.isActive !== false
      });
    });
    
    const response = await client.bulk({ body });
    
    const errors = response.body.items.filter(item => item.index.error);
    if (errors.length > 0) {
      console.error(`Bulk sync had ${errors.length} errors:`, errors);
    } else {
      console.log(`Bulk synced ${graphs.length} talent graphs to Elasticsearch`);
    }
    
    return response;
  } catch (error) {
    console.error("Error bulk syncing talent graphs to Elasticsearch:", error);
    throw error;
  }
}

// Bulk sync graphs to Qdrant
export async function bulkSyncTalentGraphsToQdrant(graphs) {
  try {
    const qdrant = getQdrantClient();
    const collectionName = 'talent-graph';
    
    // Ensure collection exists
    await ensureQdrantCollection(collectionName);
    
    const points = [];
    
    for (const graph of graphs) {
      const embedding = await generateGraphEmbedding(graph);
      
      points.push({
        id: graph._id.toString(),
        vector: embedding,
        payload: {
          id: graph.id,
          type: graph.type,
          nodeCount: graph.nodes?.length || 0,
          edgeCount: graph.edges?.length || 0,
          density: graph.graphMetadata?.density || 0,
          lastUpdated: graph.lastUpdated || new Date(),
          version: graph.version || '1.0',
          isActive: graph.isActive !== false,
          metadata: {
            nodeTypes: [...new Set(graph.nodes?.map(n => n.type) || [])],
            edgeTypes: [...new Set(graph.edges?.map(e => e.type) || [])],
            avgNodeScore: graph.nodes?.reduce((sum, n) => sum + (n.score || 0), 0) / (graph.nodes?.length || 1),
            avgEdgeStrength: graph.edges?.reduce((sum, e) => sum + (e.strength || 0), 0) / (graph.edges?.length || 1)
          }
        }
      });
    }
    
    const response = await axios.put(
      `${qdrant.url}/collections/${collectionName}/points`,
      {
        points: points
      },
      {
        headers: qdrant.headers
      }
    );
    
    console.log(`Bulk synced ${graphs.length} talent graphs to Qdrant:`, response.status);
    return response.data;
  } catch (error) {
    console.error("Error bulk syncing talent graphs to Qdrant:", error);
    throw error;
  }
}

// Remove graph from Elasticsearch
export async function removeTalentGraphFromElasticsearch(graphId) {
  try {
    const client = getElasticsearchClient();
    const indexName = 'talent-graph';
    
    const response = await client.delete({
      index: indexName,
      id: graphId
    });
    
    console.log(`Removed talent graph ${graphId} from Elasticsearch:`, response.result);
    return response;
  } catch (error) {
    console.error("Error removing talent graph from Elasticsearch:", error);
    throw error;
  }
}

// Remove graph from Qdrant
export async function removeTalentGraphFromQdrant(graphId) {
  try {
    const qdrant = getQdrantClient();
    const collectionName = 'talent-graph';
    
    const response = await axios.delete(
      `${qdrant.url}/collections/${collectionName}/points`,
      {
        params: {
          points: [graphId]
        },
        headers: qdrant.headers
      }
    );
    
    console.log(`Removed talent graph ${graphId} from Qdrant:`, response.status);
    return response.data;
  } catch (error) {
    console.error("Error removing talent graph from Qdrant:", error);
    throw error;
  }
}

// Search graphs in Elasticsearch
export async function searchTalentGraphsInElasticsearch(query, options = {}) {
  try {
    const client = getElasticsearchClient();
    const indexName = 'talent-graph';
    
    const {
      size = 20,
      from = 0,
      filters = {},
      sort = [{ lastUpdated: { order: 'desc' } }]
    } = options;
    
    const searchQuery = {
      index: indexName,
      body: {
        query: {
          bool: {
            must: [
              { term: { isActive: true } }
            ],
            filter: buildElasticsearchFilters(filters)
          }
        },
        size,
        from,
        sort,
        highlight: {
          fields: {
            "nodes.data.name": {},
            "nodes.data.fullName": {},
            "nodes.data.headline": {},
            "nodes.data.skills": {}
          }
        }
      }
    };
    
    // Add text query if provided
    if (query) {
      searchQuery.body.query.bool.must.push({
        multi_match: {
          query: query,
          fields: [
            "nodes.data.name^2",
            "nodes.data.fullName^2",
            "nodes.data.headline",
            "nodes.data.skills",
            "metadata.*"
          ],
          type: "best_fields",
          fuzziness: "AUTO"
        }
      });
    }
    
    const response = await client.search(searchQuery);
    
    const results = response.body.hits.hits.map(hit => ({
      id: hit._id,
      score: hit._score,
      source: hit._source,
      highlight: hit.highlight
    }));
    
    return {
      results,
      total: response.body.hits.total.value,
      took: response.body.took
    };
  } catch (error) {
    console.error("Error searching talent graphs in Elasticsearch:", error);
    throw error;
  }
}

// Search graphs in Qdrant (vector search)
export async function searchTalentGraphsInQdrant(queryVector, options = {}) {
  try {
    const qdrant = getQdrantClient();
    const collectionName = 'talent-graph';
    
    const {
      limit = 20,
      offset = 0,
      score_threshold = 0.3,
      filters = {},
      with_payload = true,
      with_vector = false
    } = options;
    
    const searchRequest = {
      vector: queryVector,
      limit,
      offset,
      score_threshold,
      with_payload,
      with_vector,
      filter: buildQdrantFilter(filters)
    };
    
    const response = await axios.post(
      `${qdrant.url}/collections/${collectionName}/points/search`,
      searchRequest,
      {
        headers: qdrant.headers
      }
    );
    
    const results = response.data.result.map(point => ({
      id: point.id,
      score: point.score,
      payload: point.payload,
      vector: point.vector
    }));
    
    return {
      results,
      total: results.length
    };
  } catch (error) {
    console.error("Error searching talent graphs in Qdrant:", error);
    throw error;
  }
}

// Get sync status
export async function getSyncStatus(graphId) {
  try {
    const client = getElasticsearchClient();
    const qdrant = getQdrantClient();
    
    // Check Elasticsearch
    let esStatus = 'not_synced';
    try {
      const esResponse = await client.get({
        index: 'talent-graph',
        id: graphId
      });
      esStatus = 'synced';
    } catch (error) {
      if (error.statusCode === 404) {
        esStatus = 'not_found';
      } else {
        esStatus = 'error';
      }
    }
    
    // Check Qdrant
    let qdrantStatus = 'not_synced';
    try {
      const qdrantResponse = await axios.get(
        `${qdrant.url}/collections/talent-graph/points/${graphId}`,
        {
          headers: qdrant.headers
        }
      );
      qdrantStatus = 'synced';
    } catch (error) {
      if (error.response?.status === 404) {
        qdrantStatus = 'not_found';
      } else {
        qdrantStatus = 'error';
      }
    }
    
    return {
      graphId,
      elasticsearch: esStatus,
      qdrant: qdrantStatus,
      lastChecked: new Date()
    };
  } catch (error) {
    console.error("Error getting sync status:", error);
    throw error;
  }
}

// Reindex all graphs
export async function reindexAllGraphs() {
  try {
    const TalentGraph = await import("../../models/talentGraph.model.js");
    
    const graphs = await TalentGraph.default.find({ isActive: true });
    
    console.log(`Reindexing ${graphs.length} talent graphs...`);
    
    // Sync to Elasticsearch
    await bulkSyncTalentGraphsToElasticsearch(graphs);
    
    // Sync to Qdrant
    await bulkSyncTalentGraphsToQdrant(graphs);
    
    console.log('Reindex completed successfully');
    
    return {
      success: true,
      totalGraphs: graphs.length,
      completedAt: new Date()
    };
  } catch (error) {
    console.error("Error reindexing all graphs:", error);
    throw error;
  }
}

// Helper functions
async function ensureQdrantCollection(collectionName) {
  try {
    const qdrant = getQdrantClient();
    
    // Check if collection exists
    try {
      await axios.get(
        `${qdrant.url}/collections/${collectionName}`,
        {
          headers: qdrant.headers
        }
      );
      console.log(`Qdrant collection ${collectionName} already exists`);
    } catch (error) {
      if (error.response?.status === 404) {
        // Create collection
        await axios.put(
          `${qdrant.url}/collections/${collectionName}`,
          {
            vectors: {
              size: 1536, // Standard embedding size
              distance: "Cosine"
            }
          },
          {
            headers: qdrant.headers
          }
        );
        console.log(`Created Qdrant collection ${collectionName}`);
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error("Error ensuring Qdrant collection:", error);
    throw error;
  }
}

async function generateGraphEmbedding(graphData) {
  try {
    // Generate text representation of graph for embedding
    const textRepresentation = buildGraphTextRepresentation(graphData);
    
    // Check if AI service is available
    const { checkAiHealth } = await import("../../../sourcing/ai/aiServiceClient.js");
    const aiAvailable = await checkAiHealth().then(h => h.status === 'ok').catch(() => false);
    
    if (aiAvailable) {
      // Use AI service for embedding
      const { embedText } = await import("../../../sourcing/ai/aiServiceClient.js");
      const embedding = await embedText(textRepresentation);
      return embedding;
    } else {
      // Fallback to simple embedding generation
      return generateSimpleEmbedding(textRepresentation);
    }
  } catch (error) {
    console.error("Error generating graph embedding:", error);
    // Return zero embedding as fallback
    return new Array(1536).fill(0);
  }
}

function buildGraphTextRepresentation(graphData) {
  try {
    const parts = [];
    
    // Add basic graph info
    parts.push(`Graph type: ${graphData.type}`);
    parts.push(`Node count: ${graphData.nodes?.length || 0}`);
    parts.push(`Edge count: ${graphData.edges?.length || 0}`);
    
    // Add node information
    if (graphData.nodes && graphData.nodes.length > 0) {
      const nodeTypes = {};
      const nodeNames = [];
      
      graphData.nodes.forEach(node => {
        nodeTypes[node.type] = (nodeTypes[node.type] || 0) + 1;
        
        if (node.data) {
          if (node.data.name) nodeNames.push(node.data.name);
          if (node.data.fullName) nodeNames.push(node.data.fullName);
          if (node.data.headline) nodeNames.push(node.data.headline);
          if (node.data.skills) nodeNames.push(...node.data.skills);
        }
      });
      
      parts.push(`Node types: ${Object.entries(nodeTypes).map(([type, count]) => `${type}(${count})`).join(', ')}`);
      parts.push(`Key entities: ${nodeNames.slice(0, 10).join(', ')}`);
    }
    
    // Add edge information
    if (graphData.edges && graphData.edges.length > 0) {
      const edgeTypes = {};
      
      graphData.edges.forEach(edge => {
        edgeTypes[edge.type] = (edgeTypes[edge.type] || 0) + 1;
      });
      
      parts.push(`Edge types: ${Object.entries(edgeTypes).map(([type, count]) => `${type}(${count})`).join(', ')}`);
    }
    
    // Add metadata
    if (graphData.graphMetadata) {
      if (graphData.graphMetadata.density) {
        parts.push(`Density: ${graphData.graphMetadata.density.toFixed(3)}`);
      }
      if (graphData.graphMetadata.clustering) {
        parts.push(`Clustering: ${graphData.graphMetadata.clustering.toFixed(3)}`);
      }
    }
    
    return parts.join('. ');
  } catch (error) {
    console.error("Error building graph text representation:", error);
    return `Graph ${graphData.type} with ${graphData.nodes?.length || 0} nodes and ${graphData.edges?.length || 0} edges`;
  }
}

function generateSimpleEmbedding(text) {
  try {
    // Simple hash-based embedding generation (fallback)
    const embedding = new Array(1536).fill(0);
    
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const index = charCode % embedding.length;
      embedding[index] = (embedding[index] + charCode / 255) / 2;
    }
    
    return embedding;
  } catch (error) {
    console.error("Error generating simple embedding:", error);
    return new Array(1536).fill(0);
  }
}

function buildElasticsearchFilters(filters) {
  try {
    const esFilters = [];
    
    if (filters.type) {
      esFilters.push({ term: { type: filters.type } });
    }
    
    if (filters.nodeType) {
      esFilters.push({ term: { "nodes.type": filters.nodeType } });
    }
    
    if (filters.edgeType) {
      esFilters.push({ term: { "edges.type": filters.edgeType } });
    }
    
    if (filters.minNodeCount !== undefined) {
      esFilters.push({ range: { nodeCount: { gte: filters.minNodeCount } } });
    }
    
    if (filters.maxNodeCount !== undefined) {
      esFilters.push({ range: { nodeCount: { lte: filters.maxNodeCount } } });
    }
    
    if (filters.minDensity !== undefined) {
      esFilters.push({ range: { "graphMetadata.density": { gte: filters.minDensity } } });
    }
    
    if (filters.lastUpdatedAfter) {
      esFilters.push({ range: { lastUpdated: { gte: filters.lastUpdatedAfter } } });
    }
    
    return esFilters;
  } catch (error) {
    console.error("Error building Elasticsearch filters:", error);
    return [];
  }
}

function buildQdrantFilter(filters) {
  try {
    const qdrantFilter = {
      must: [],
      must_not: []
    };
    
    if (filters.type) {
      qdrantFilter.must.push({
        key: "type",
        match: { value: filters.type }
      });
    }
    
    if (filters.nodeType) {
      qdrantFilter.must.push({
        key: "metadata.nodeTypes",
        match: { value: filters.nodeType }
      });
    }
    
    if (filters.edgeType) {
      qdrantFilter.must.push({
        key: "metadata.edgeTypes",
        match: { value: filters.edgeType }
      });
    }
    
    if (filters.minNodeCount !== undefined) {
      qdrantFilter.must.push({
        key: "nodeCount",
        range: { gte: filters.minNodeCount }
      });
    }
    
    if (filters.maxNodeCount !== undefined) {
      qdrantFilter.must.push({
        key: "nodeCount",
        range: { lte: filters.maxNodeCount }
      });
    }
    
    if (filters.minDensity !== undefined) {
      qdrantFilter.must.push({
        key: "density",
        range: { gte: filters.minDensity }
      });
    }
    
    return qdrantFilter;
  } catch (error) {
    console.error("Error building Qdrant filter:", error);
    return null;
  }
}

// Health check for sync services
export async function checkSyncHealth() {
  try {
    const health = {
      elasticsearch: 'unknown',
      qdrant: 'unknown',
      overall: 'unknown'
    };
    
    // Check Elasticsearch
    try {
      const client = getElasticsearchClient();
      await client.ping();
      health.elasticsearch = 'healthy';
    } catch (error) {
      health.elasticsearch = 'unhealthy';
    }
    
    // Check Qdrant
    try {
      const qdrant = getQdrantClient();
      await axios.get(`${qdrant.url}/health`, {
        headers: qdrant.headers
      });
      health.qdrant = 'healthy';
    } catch (error) {
      health.qdrant = 'unhealthy';
    }
    
    // Overall health
    health.overall = (health.elasticsearch === 'healthy' && health.qdrant === 'healthy') 
      ? 'healthy' 
      : 'degraded';
    
    return health;
  } catch (error) {
    console.error("Error checking sync health:", error);
    return {
      elasticsearch: 'error',
      qdrant: 'error',
      overall: 'error'
    };
  }
}
