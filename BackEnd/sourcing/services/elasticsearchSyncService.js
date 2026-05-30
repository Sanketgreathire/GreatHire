/**
 * elasticsearchSyncService.js
 *
 * Stub implementation — ready for real Elasticsearch integration.
 * When ES is configured (ELASTICSEARCH_URL in .env), this will index candidates.
 * Until then, all operations are no-ops and log a warning.
 *
 * To enable: npm install @elastic/elasticsearch
 * Then set ELASTICSEARCH_URL=http://localhost:9200 in .env
 */

const ES_URL     = process.env.ELASTICSEARCH_URL || "";
const ES_INDEX   = process.env.ES_CANDIDATE_INDEX || "sourcing_candidates";
let   esClient   = null;
let   esEnabled  = false;

async function getClient() {
  if (!ES_URL) return null;
  if (esClient)  return esClient;

  try {
    const { Client } = await import("@elastic/elasticsearch");
    esClient  = new Client({ node: ES_URL });
    esEnabled = true;
    console.log("✅ Elasticsearch client initialized");
    return esClient;
  } catch {
    console.warn("⚠️  @elastic/elasticsearch not installed — ES sync disabled.");
    return null;
  }
}

/**
 * Index a single candidate document into Elasticsearch.
 */
export async function indexCandidate(candidate) {
  const client = await getClient();
  if (!client) return;

  try {
    await client.index({
      index: ES_INDEX,
      id:    candidate._id.toString(),
      document: {
        fullName:         candidate.fullName,
        emails:           candidate.emails,
        skills:           candidate.normalizedSkills || candidate.skills,
        designation:      candidate.designation,
        currentCompany:   candidate.currentCompany,
        location:         candidate.location,
        totalExperience:  candidate.totalExperience,
        sourceType:       candidate.sourceType,
        createdBy:        candidate.createdBy?.toString(),
        createdAt:        candidate.createdAt,
        summary:          candidate.summary || "",
      },
    });

    // Mark as indexed in MongoDB
    const { SourcingCandidate } = await import("../../models/sourcing/sourcingCandidate.model.js");
    await SourcingCandidate.findByIdAndUpdate(candidate._id, {
      $set: { esIndexed: true, esIndexedAt: new Date() },
    });
  } catch (err) {
    console.error("ES index error:", err.message);
  }
}

/**
 * Bulk index multiple candidates.
 */
export async function bulkIndexCandidates(candidates) {
  const client = await getClient();
  if (!client || !candidates.length) return;

  try {
    const operations = candidates.flatMap((c) => [
      { index: { _index: ES_INDEX, _id: c._id.toString() } },
      {
        fullName:        c.fullName,
        emails:          c.emails,
        skills:          c.normalizedSkills || c.skills,
        designation:     c.designation,
        currentCompany:  c.currentCompany,
        location:        c.location,
        totalExperience: c.totalExperience,
        sourceType:      c.sourceType,
        createdBy:       c.createdBy?.toString(),
        createdAt:       c.createdAt,
      },
    ]);

    await client.bulk({ operations });
  } catch (err) {
    console.error("ES bulk index error:", err.message);
  }
}

/**
 * Delete a candidate from Elasticsearch.
 */
export async function deleteFromIndex(candidateId) {
  const client = await getClient();
  if (!client) return;
  try {
    await client.delete({ index: ES_INDEX, id: candidateId.toString() });
  } catch (err) {
    if (err.meta?.statusCode !== 404) console.error("ES delete error:", err.message);
  }
}

export function isEsEnabled() { return esEnabled; }
