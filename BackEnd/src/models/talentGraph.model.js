import mongoose from "mongoose";

const talentGraphSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ["candidate", "company", "skill", "industry", "recruiter"],
    required: true
  },
  nodes: [{
    id: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ["candidate", "company", "skill", "industry", "recruiter"],
      required: true
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 1
    },
    influence: {
      type: Number,
      default: 0,
      min: 0,
      max: 1
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  edges: [{
    id: {
      type: String,
      required: true
    },
    source: {
      type: String,
      required: true
    },
    target: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: [
        "knows", "works_at", "has_skill", "in_industry", "recruited_by",
        "colleague", "classmate", "similar_skills", "career_progression",
        "company_transition", "skill_adjacency", "network_connection"
      ],
      required: true
    },
    strength: {
      type: Number,
      default: 0.5,
      min: 0,
      max: 1
    },
    weight: {
      type: Number,
      default: 0.5,
      min: 0,
      max: 1
    },
    frequency: {
      type: Number,
      default: 1,
      min: 1
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  candidateRelationships: [{
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SourcingCandidate",
      required: true
    },
    relatedCandidates: [{
      candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SourcingCandidate"
      },
      relationshipType: {
        type: String,
        enum: ["colleague", "classmate", "similar_background", "network_connection"],
        required: true
      },
      strength: {
        type: Number,
        default: 0.5,
        min: 0,
        max: 1
      },
      sharedAttributes: [{
        type: String,
        enum: ["company", "school", "skills", "location", "industry"]
      }],
      metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
      }
    }],
    influenceScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 1
    },
    networkCentrality: {
      degree: {
        type: Number,
        default: 0
      },
      betweenness: {
        type: Number,
        default: 0
      },
      closeness: {
        type: Number,
        default: 0
      },
      eigenvector: {
        type: Number,
        default: 0
      }
    }
  }],
  companyRelationships: [{
    companyId: {
      type: String,
      required: true
    },
    relatedCompanies: [{
      companyId: {
        type: String
      },
      relationshipType: {
        type: String,
        enum: ["competitor", "partner", "supplier", "customer", "acquisition_target"],
        required: true
      },
      strength: {
        type: Number,
        default: 0.5,
        min: 0,
        max: 1
      },
      talentFlow: {
        fromTo: {
          type: Number,
          default: 0
        },
        toFrom: {
          type: Number,
          default: 0
        },
        netFlow: {
          type: Number,
          default: 0
        }
      },
      similarity: {
        industry: {
          type: Number,
          default: 0
        },
        size: {
          type: Number,
          default: 0
        },
        location: {
          type: Number,
          default: 0
        }
      }
    }],
    movementPatterns: [{
      fromCompany: String,
      toCompany: String,
      candidateCount: {
        type: Number,
        default: 0
      },
      avgTimeInRole: {
        type: Number,
        default: 0
      },
      commonRoles: [String],
      skillsTransition: [String]
    }],
    talentPoolMetrics: {
      currentEmployees: {
        type: Number,
        default: 0
      },
      alumniCount: {
        type: Number,
        default: 0
      },
      retentionRate: {
        type: Number,
        default: 0
      },
      avgExperience: {
        type: Number,
        default: 0
      }
    }
  }],
  skillRelationships: [{
    skillId: {
      type: String,
      required: true
    },
    relatedSkills: [{
      skillId: {
        type: String
      },
      relationshipType: {
        type: String,
        enum: ["adjacent", "prerequisite", "complementary", "substitute", "emerging_together"],
        required: true
      },
      proximity: {
        type: Number,
        default: 0.5,
        min: 0,
        max: 1
      },
      cooccurrence: {
        type: Number,
        default: 0
      },
      compatibility: {
        type: Number,
        default: 0.5,
        min: 0,
        max: 1
      },
      demand: {
        current: {
          type: Number,
          default: 0
        },
        projected: {
          type: Number,
          default: 0
        },
        growth: {
          type: Number,
          default: 0
        }
      }
    }],
    clusters: [{
      clusterId: String,
      skills: [String],
      clusterType: {
        type: String,
        enum: ["technical", "domain", "emerging", "stable", "declining"],
        default: "technical"
      },
      confidence: {
        type: Number,
        default: 0.5,
        min: 0,
        max: 1
      },
      size: {
        type: Number,
        default: 0
      },
      growthRate: {
        type: Number,
        default: 0
      }
    }],
    evolution: [{
      timeframe: String,
      skills: [String],
      demand: Number,
      growth: Number,
      emerging: Boolean
    }]
  }],
  graphMetadata: {
    nodeCount: {
      type: Number,
      default: 0
    },
    edgeCount: {
      type: Number,
      default: 0
    },
    density: {
      type: Number,
      default: 0
    },
    clustering: {
      type: Number,
      default: 0
    },
    diameter: {
      type: Number,
      default: 0
    },
    avgPathLength: {
      type: Number,
      default: 0
    },
    modularity: {
      type: Number,
      default: 0
    }
  },
  movementIntelligence: {
    companyToCompany: [{
      fromCompany: String,
      toCompany: String,
      candidateCount: Number,
      avgTimeInRole: Number,
      commonRoles: [String],
      transitionType: {
        type: String,
        enum: ["promotion", "lateral", "industry_change", "career_change"],
        default: "lateral"
      },
      successRate: Number
    }],
    startupToEnterprise: [{
      candidateId: mongoose.Schema.Types.ObjectId,
      fromCompany: String,
      toCompany: String,
      transitionDate: Date,
      role: String,
      skills: [String],
      transitionType: {
        type: String,
        enum: ["startup_to_enterprise", "enterprise_to_startup"],
        default: "startup_to_enterprise"
      }
    }],
    fintechTalentPools: [{
      company: String,
      totalCandidates: Number,
      skillDistribution: [{
        skill: String,
        count: Number,
        percentage: Number
      }],
      experienceDistribution: [{
        range: String,
        count: Number,
        percentage: Number
      }],
      growthMetrics: {
        growthRate: Number,
        skillGrowthRate: Number,
        experienceGrowthRate: Number,
        diversityMetrics: Object
      }
    }],
    fastGrowingCompanies: [{
      company: String,
      growth: {
        growthRate: Number,
        talentGrowth: Number,
        skillGrowth: Number,
        marketPosition: String
      },
      talentMovement: [{
        candidateId: mongoose.Schema.Types.ObjectId,
        direction: String,
        date: Date,
        role: String
      }]
    }]
  },
  scoring: {
    relationshipStrength: {
      type: Map,
      of: {
        strength: {
          type: Number,
          default: 0.5
        },
        confidence: {
          type: Number,
          default: 0.5
        },
        lastUpdated: {
          type: Date,
          default: Date.now
        }
      },
      default: new Map()
    },
    skillProximity: {
      type: Map,
      of: {
        proximity: {
          type: Number,
          default: 0.5
        },
        cooccurrence: {
          type: Number,
          default: 0
        },
        compatibility: {
          type: Number,
          default: 0.5
        },
        lastUpdated: {
          type: Date,
          default: Date.now
        }
      },
      default: new Map()
    },
    companySimilarity: {
      type: Map,
      of: {
        similarity: {
          type: Number,
          default: 0.5
        },
        industry: {
          type: Number,
          default: 0
        },
        size: {
          type: Number,
          default: 0
        },
        location: {
          type: Number,
          default: 0
        },
        lastUpdated: {
          type: Date,
          default: Date.now
        }
      },
      default: new Map()
    },
    candidateInfluence: {
      type: Map,
      of: {
        influence: {
          type: Number,
          default: 0.5
        },
        reach: {
          type: Number,
          default: 0
        },
        centrality: {
          degree: {
            type: Number,
            default: 0
          },
          betweenness: {
            type: Number,
            default: 0
          },
          closeness: {
            type: Number,
            default: 0
          },
          eigenvector: {
            type: Number,
            default: 0
          }
        },
        lastUpdated: {
          type: Date,
          default: Date.now
        }
      },
      default: new Map()
    }
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  version: {
    type: String,
    default: "1.0"
  },
  isActive: {
    type: Boolean,
    default: true
  },
  archivedAt: Date
}, {
  timestamps: true,
  collection: "talentgraphs"
});

talentGraphSchema.index({ id: 1, type: 1 }, { unique: true });
talentGraphSchema.index({ type: 1 });
talentGraphSchema.index({ "nodes.type": 1 });
talentGraphSchema.index({ "edges.type": 1 });
talentGraphSchema.index({ "candidateRelationships.candidateId": 1 });
talentGraphSchema.index({ "companyRelationships.companyId": 1 });
talentGraphSchema.index({ "skillRelationships.skillId": 1 });
talentGraphSchema.index({ lastUpdated: -1 });
talentGraphSchema.index({ "graphMetadata.density": -1 });
talentGraphSchema.index({ "scoring.candidateInfluence.influence": -1 });

talentGraphSchema.pre("save", function(next) {
  this.lastUpdated = new Date();
  
  // Update graph metadata
  this.graphMetadata.nodeCount = this.nodes.length;
  this.graphMetadata.edgeCount = this.edges.length;
  
  // Calculate density
  const maxEdges = (this.nodes.length * (this.nodes.length - 1)) / 2;
  this.graphMetadata.density = maxEdges > 0 ? this.edges.length / maxEdges : 0;
  
  next();
});

talentGraphSchema.methods.addNode = function(nodeData) {
  try {
    const existingNode = this.nodes.find(node => node.id === nodeData.id);
    
    if (existingNode) {
      // Update existing node
      Object.assign(existingNode, nodeData);
      existingNode.updatedAt = new Date();
    } else {
      // Add new node
      const newNode = {
        ...nodeData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.nodes.push(newNode);
    }
    
    return this.save();
  } catch (error) {
    console.error("Error adding node to talent graph:", error);
    throw error;
  }
};

talentGraphSchema.methods.addEdge = function(edgeData) {
  try {
    const existingEdge = this.edges.find(edge => 
      edge.source === edgeData.source && edge.target === edgeData.target
    );
    
    if (existingEdge) {
      // Update existing edge
      Object.assign(existingEdge, edgeData);
      existingEdge.updatedAt = new Date();
    } else {
      // Add new edge
      const newEdge = {
        ...edgeData,
        id: edgeData.id || `${edgeData.source}-${edgeData.target}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.edges.push(newEdge);
    }
    
    return this.save();
  } catch (error) {
    console.error("Error adding edge to talent graph:", error);
    throw error;
  }
};

talentGraphSchema.methods.removeNode = function(nodeId) {
  try {
    this.nodes = this.nodes.filter(node => node.id !== nodeId);
    this.edges = this.edges.filter(edge => 
      edge.source !== nodeId && edge.target !== nodeId
    );
    
    return this.save();
  } catch (error) {
    console.error("Error removing node from talent graph:", error);
    throw error;
  }
};

talentGraphSchema.methods.removeEdge = function(edgeId) {
  try {
    this.edges = this.edges.filter(edge => edge.id !== edgeId);
    
    return this.save();
  } catch (error) {
    console.error("Error removing edge from talent graph:", error);
    throw error;
  }
};

talentGraphSchema.methods.updateNodeScore = function(nodeId, score) {
  try {
    const node = this.nodes.find(node => node.id === nodeId);
    
    if (node) {
      node.score = Math.max(0, Math.min(1, score));
      node.updatedAt = new Date();
      
      // Update scoring map
      if (node.type === 'candidate') {
        const existingScore = this.scoring.candidateInfluence.get(nodeId) || {};
        this.scoring.candidateInfluence.set(nodeId, {
          ...existingScore,
          influence: score,
          lastUpdated: new Date()
        });
      }
      
      return this.save();
    }
    
    throw new Error(`Node ${nodeId} not found`);
  } catch (error) {
    console.error("Error updating node score:", error);
    throw error;
  }
};

talentGraphSchema.methods.updateEdgeStrength = function(edgeId, strength) {
  try {
    const edge = this.edges.find(edge => edge.id === edgeId);
    
    if (edge) {
      edge.strength = Math.max(0, Math.min(1, strength));
      edge.updatedAt = new Date();
      
      // Update relationship strength
      const edgeKey = `${edge.source}-${edge.target}`;
      this.scoring.relationshipStrength.set(edgeKey, {
        strength: strength,
        confidence: 0.8,
        lastUpdated: new Date()
      });
      
      return this.save();
    }
    
    throw new Error(`Edge ${edgeId} not found`);
  } catch (error) {
    console.error("Error updating edge strength:", error);
    throw error;
  }
};

talentGraphSchema.methods.getNeighbors = function(nodeId, maxDepth = 1) {
  try {
    const neighbors = new Set();
    const visited = new Set([nodeId]);
    const queue = [{ id: nodeId, depth: 0 }];
    
    while (queue.length > 0 && queue[0].depth < maxDepth) {
      const current = queue.shift();
      
      this.edges.forEach(edge => {
        let neighborId = null;
        
        if (edge.source === current.id) {
          neighborId = edge.target;
        } else if (edge.target === current.id) {
          neighborId = edge.source;
        }
        
        if (neighborId && !visited.has(neighborId)) {
          visited.add(neighborId);
          neighbors.add(neighborId);
          
          if (current.depth < maxDepth - 1) {
            queue.push({ id: neighborId, depth: current.depth + 1 });
          }
        }
      });
    }
    
    return Array.from(neighbors);
  } catch (error) {
    console.error("Error getting neighbors:", error);
    return [];
  }
};

talentGraphSchema.methods.getShortestPath = function(sourceId, targetId) {
  try {
    const visited = new Set();
    const queue = [{ id: sourceId, path: [sourceId] }];
    
    while (queue.length > 0) {
      const current = queue.shift();
      
      if (current.id === targetId) {
        return current.path;
      }
      
      if (visited.has(current.id)) {
        continue;
      }
      
      visited.add(current.id);
      
      this.edges.forEach(edge => {
        let neighborId = null;
        
        if (edge.source === current.id) {
          neighborId = edge.target;
        } else if (edge.target === current.id) {
          neighborId = edge.source;
        }
        
        if (neighborId && !visited.has(neighborId)) {
          queue.push({
            id: neighborId,
            path: [...current.path, neighborId]
          });
        }
      });
    }
    
    return null; // No path found
  } catch (error) {
    console.error("Error getting shortest path:", error);
    return null;
  }
};

talentGraphSchema.methods.calculateCentrality = function(nodeId) {
  try {
    const node = this.nodes.find(n => n.id === nodeId);
    if (!node) return null;
    
    const degree = this.edges.filter(edge => 
      edge.source === nodeId || edge.target === nodeId
    ).length;
    
    const betweenness = this.calculateBetweennessCentrality(nodeId);
    const closeness = this.calculateClosenessCentrality(nodeId);
    const eigenvector = this.calculateEigenvectorCentrality(nodeId);
    
    return {
      degree: degree / (this.nodes.length - 1),
      betweenness,
      closeness,
      eigenvector
    };
  } catch (error) {
    console.error("Error calculating centrality:", error);
    return null;
  }
};

talentGraphSchema.methods.calculateBetweennessCentrality = function(nodeId) {
  try {
    let betweenness = 0;
    const otherNodes = this.nodes.filter(n => n.id !== nodeId);
    
    for (let i = 0; i < otherNodes.length; i++) {
      for (let j = i + 1; j < otherNodes.length; j++) {
        const path = this.getShortestPath(otherNodes[i].id, otherNodes[j].id);
        
        if (path && path.includes(nodeId)) {
          betweenness++;
        }
      }
    }
    
    const totalPairs = (this.nodes.length - 1) * (this.nodes.length - 2) / 2;
    return totalPairs > 0 ? betweenness / totalPairs : 0;
  } catch (error) {
    console.error("Error calculating betweenness centrality:", error);
    return 0;
  }
};

talentGraphSchema.methods.calculateClosenessCentrality = function(nodeId) {
  try {
    let totalDistance = 0;
    let reachableNodes = 0;
    
    this.nodes.forEach(node => {
      if (node.id !== nodeId) {
        const path = this.getShortestPath(nodeId, node.id);
        if (path) {
          totalDistance += path.length - 1;
          reachableNodes++;
        }
      }
    });
    
    return reachableNodes > 0 ? reachableNodes / totalDistance : 0;
  } catch (error) {
    console.error("Error calculating closeness centrality:", error);
    return 0;
  }
};

talentGraphSchema.methods.calculateEigenvectorCentrality = function(nodeId) {
  try {
    const node = this.nodes.find(n => n.id === nodeId);
    if (!node) return 0;
    
    let centrality = 0;
    
    this.edges.forEach(edge => {
      let neighborId = null;
      
      if (edge.source === nodeId) {
        neighborId = edge.target;
      } else if (edge.target === nodeId) {
        neighborId = edge.source;
      }
      
      if (neighborId) {
        const neighbor = this.nodes.find(n => n.id === neighborId);
        if (neighbor) {
          centrality += neighbor.influence * edge.strength;
        }
      }
    });
    
    return centrality;
  } catch (error) {
    console.error("Error calculating eigenvector centrality:", error);
    return 0;
  }
};

talentGraphSchema.methods.detectCommunities = function() {
  try {
    const communities = new Map();
    let communityId = 0;
    
    const visited = new Set();
    
    this.nodes.forEach(node => {
      if (!visited.has(node.id)) {
        const community = this.expandCommunity(node.id, visited);
        
        community.forEach(nodeId => {
          communities.set(nodeId, communityId);
        });
        
        communityId++;
      }
    });
    
    return communities;
  } catch (error) {
    console.error("Error detecting communities:", error);
    return new Map();
  }
};

talentGraphSchema.methods.expandCommunity = function(startNodeId, visited) {
  try {
    const community = new Set();
    const queue = [startNodeId];
    
    while (queue.length > 0) {
      const currentId = queue.shift();
      
      if (visited.has(currentId)) {
        continue;
      }
      
      visited.add(currentId);
      community.add(currentId);
      
      this.edges.forEach(edge => {
        let neighborId = null;
        
        if (edge.source === currentId) {
          neighborId = edge.target;
        } else if (edge.target === currentId) {
          neighborId = edge.source;
        }
        
        if (neighborId && edge.strength > 0.5 && !visited.has(neighborId)) {
          queue.push(neighborId);
        }
      });
    }
    
    return community;
  } catch (error) {
    console.error("Error expanding community:", error);
    return new Set();
  }
};

talentGraphSchema.methods.calculateModularity = function(communities) {
  try {
    let modularity = 0;
    const totalEdges = this.edges.length;
    
    if (totalEdges === 0) return 0;
    
    this.edges.forEach(edge => {
      const sourceCommunity = communities.get(edge.source);
      const targetCommunity = communities.get(edge.target);
      
      if (sourceCommunity === targetCommunity) {
        modularity += edge.strength;
      }
    });
    
    return modularity / totalEdges;
  } catch (error) {
    console.error("Error calculating modularity:", error);
    return 0;
  }
};

talentGraphSchema.methods.archive = function() {
  try {
    this.isActive = false;
    this.archivedAt = new Date();
    return this.save();
  } catch (error) {
    console.error("Error archiving talent graph:", error);
    throw error;
  }
};

talentGraphSchema.statics.getGraphByType = async function(type, id) {
  try {
    return await this.findOne({ id, type, isActive: true });
  } catch (error) {
    console.error("Error getting graph by type:", error);
    return null;
  }
};

talentGraphSchema.statics.getGraphsByType = async function(type) {
  try {
    return await this.find({ type, isActive: true })
      .sort({ lastUpdated: -1 });
  } catch (error) {
    console.error("Error getting graphs by type:", error);
    return [];
  }
};

talentGraphSchema.statics.searchGraphs = async function(query, options = {}) {
  try {
    const { nodeType, maxResults = 20, includeMetadata = true } = options;
    
    const searchQuery = {
      isActive: true,
      $or: [
        { "nodes.data.name": { $regex: query, $options: "i" } },
        { "nodes.data.fullName": { $regex: query, $options: "i" } },
        { "nodes.data.headline": { $regex: query, $options: "i" } },
        { "nodes.data.skills": { $regex: query, $options: "i" } }
      ]
    };
    
    if (nodeType) {
      searchQuery["nodes.type"] = nodeType;
    }
    
    const graphs = await this.find(searchQuery)
      .limit(maxResults)
      .sort({ "graphMetadata.density": -1 });
    
    const results = graphs.map(graph => {
      const matchingNodes = graph.nodes.filter(node => {
        if (nodeType && node.type !== nodeType) return false;
        
        const data = node.data;
        return (
          (data.name && data.name.toLowerCase().includes(query.toLowerCase())) ||
          (data.fullName && data.fullName.toLowerCase().includes(query.toLowerCase())) ||
          (data.headline && data.headline.toLowerCase().includes(query.toLowerCase())) ||
          (data.skills && data.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase())))
        );
      });
      
      return {
        graphId: graph.id,
        graphType: graph.type,
        matchingNodes: matchingNodes.map(node => ({
          id: node.id,
          type: node.type,
          data: includeMetadata ? node.data : { name: node.data.name || node.data.fullName },
          score: node.score,
          influence: node.influence
        })),
        totalMatches: matchingNodes.length,
        graphDensity: graph.graphMetadata.density,
        nodeCount: graph.graphMetadata.nodeCount,
        edgeCount: graph.graphMetadata.edgeCount
      };
    });
    
    return results;
  } catch (error) {
    console.error("Error searching graphs:", error);
    return [];
  }
};

talentGraphSchema.statics.getGraphStats = async function() {
  try {
    const stats = await this.aggregate([
      {
        $match: { isActive: true }
      },
      {
        $group: {
          _id: null,
          totalGraphs: { $sum: 1 },
          totalNodes: { $sum: "$graphMetadata.nodeCount" },
          totalEdges: { $sum: "$graphMetadata.edgeCount" },
          avgDensity: { $avg: "$graphMetadata.density" },
          avgClustering: { $avg: "$graphMetadata.clustering" },
          avgDiameter: { $avg: "$graphMetadata.diameter" },
          graphsByType: {
            $push: {
              type: "$type",
              nodeCount: "$graphMetadata.nodeCount",
              edgeCount: "$graphMetadata.edgeCount"
            }
          }
        }
      }
    ]);
    
    const result = stats[0] || {
      totalGraphs: 0,
      totalNodes: 0,
      totalEdges: 0,
      avgDensity: 0,
      avgClustering: 0,
      avgDiameter: 0,
      graphsByType: []
    };
    
    // Group by type
    const typeStats = {};
    result.graphsByType.forEach(graph => {
      if (!typeStats[graph.type]) {
        typeStats[graph.type] = {
          count: 0,
          totalNodes: 0,
          totalEdges: 0
        };
      }
      typeStats[graph.type].count++;
      typeStats[graph.type].totalNodes += graph.nodeCount;
      typeStats[graph.type].totalEdges += graph.edgeCount;
    });
    
    result.graphsByType = Object.entries(typeStats).map(([type, stats]) => ({
      type,
      count: stats.count,
      avgNodes: stats.totalNodes / stats.count,
      avgEdges: stats.totalEdges / stats.count
    }));
    
    return result;
  } catch (error) {
    console.error("Error getting graph stats:", error);
    return {
      totalGraphs: 0,
      totalNodes: 0,
      totalEdges: 0,
      avgDensity: 0,
      avgClustering: 0,
      avgDiameter: 0,
      graphsByType: []
    };
  }
};

talentGraphSchema.statics.getTopInfluencers = async function(nodeType = "candidate", limit = 20) {
  try {
    const graphs = await this.find({
      isActive: true,
      "nodes.type": nodeType
    });
    
    const influencers = [];
    
    graphs.forEach(graph => {
      const candidateNodes = graph.nodes.filter(node => node.type === nodeType);
      
      candidateNodes.forEach(node => {
        const centrality = graph.calculateCentrality(node.id);
        
        if (centrality) {
          influencers.push({
            nodeId: node.id,
            nodeType: node.type,
            data: node.data,
            influence: node.influence,
            score: node.score,
            centrality,
            graphId: graph.id,
            graphType: graph.type
          });
        }
      });
    });
    
    return influencers
      .sort((a, b) => b.centrality.eigenvector - a.centrality.eigenvector)
      .slice(0, limit);
  } catch (error) {
    console.error("Error getting top influencers:", error);
    return [];
  }
};

talentGraphSchema.statics.cleanupArchived = async function(olderThanDays = 30) {
  try {
    const cutoffDate = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000);
    
    const result = await this.deleteMany({
      isActive: false,
      archivedAt: { $lt: cutoffDate }
    });
    
    console.log(`Cleaned up ${result.deletedCount} archived talent graphs`);
    return result.deletedCount;
  } catch (error) {
    console.error("Error cleaning up archived graphs:", error);
    return 0;
  }
};

const TalentGraph = mongoose.model("TalentGraph", talentGraphSchema);

export default TalentGraph;
