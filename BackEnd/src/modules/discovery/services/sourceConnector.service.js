import axios from "axios";
import { profileNormalizationService } from "./profileNormalization.service.js";
import { profileDeduplicationService } from "./profileDeduplication.service.js";
import { enqueueEmbedding } from "../../../../sourcing/ai/embeddingQueue.js";
import { enqueueSingleEnrichment } from "../../enrichment/services/enrichmentQueue.service.js";
import { SourcingCandidate } from "../../../../models/sourcing/sourcingCandidate.model.js";
import { SourceMetadata } from "../../../models/sourceMetadata.model.js";

export class SourceConnector {
  constructor(name, config = {}) {
    this.name = name;
    this.config = config;
    this.status = "idle";
    this.lastRun = null;
    this.stats = {
      totalFetched: 0,
      totalProcessed: 0,
      totalDeduplicated: 0,
      totalSaved: 0,
      totalErrors: 0
    };
  }

  async fetchProfiles(options = {}) {
    throw new Error("fetchProfiles must be implemented by connector");
  }

  async parseProfiles(rawData) {
    throw new Error("parseProfiles must be implemented by connector");
  }

  async normalizeProfiles(profiles) {
    return profileNormalizationService.normalizeProfiles(profiles, this.name);
  }

  async deduplicateProfiles(profiles) {
    return profileDeduplicationService.deduplicateProfiles(profiles);
  }

  async saveCandidate(profile, sourceMetadata) {
    try {
      const candidate = new SourcingCandidate({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        location: profile.location,
        skills: profile.skills,
        experience: profile.experience,
        education: profile.education,
        portfolio: profile.portfolio,
        githubUrl: profile.githubUrl,
        linkedinUrl: profile.linkedinUrl,
        resumeUrl: profile.resumeUrl,
        source: "discovery",
        isActive: true,
        sources: [sourceMetadata]
      });

      const savedCandidate = await candidate.save();
      this.stats.totalSaved++;
      return savedCandidate;
    } catch (error) {
      console.error("Error saving candidate:", error);
      this.stats.totalErrors++;
      throw error;
    }
  }

  async enqueueEmbeddings(candidate) {
    try {
      await enqueueEmbedding(candidate._id);
    } catch (error) {
      console.error("Error enqueuing embedding:", error);
      this.stats.totalErrors++;
    }
  }

  async enqueueEnrichment(candidate) {
    try {
      await enqueueSingleEnrichment({ candidateId: candidate._id.toString() });
    } catch (error) {
      console.error("Error enqueuing enrichment:", error);
      this.stats.totalErrors++;
    }
  }

  async createSourceMetadata(profile, sourceUrl, confidenceScore = 1.0) {
    return new SourceMetadata({
      sourceType: this.name,
      sourceUrl,
      fetchedAt: new Date(),
      ingestionStatus: "processing",
      connectorName: this.name,
      confidenceScore,
      profileData: {
        name: profile.name,
        email: profile.email,
        skills: profile.skills,
        location: profile.location
      }
    });
  }

  async processProfiles(options = {}) {
    this.status = "running";
    this.lastRun = new Date();

    try {
      const rawData = await this.fetchProfiles(options);
      this.stats.totalFetched = rawData.length;

      const parsedProfiles = await this.parseProfiles(rawData);
      
      const normalizedProfiles = await this.normalizeProfiles(parsedProfiles);
      
      const deduplicatedProfiles = await this.deduplicateProfiles(normalizedProfiles);
      this.stats.totalDeduplicated = parsedProfiles.length - deduplicatedProfiles.length;

      const results = [];
      for (const profile of deduplicatedProfiles) {
        try {
          const sourceMetadata = await this.createSourceMetadata(
            profile,
            profile.sourceUrl || "",
            profile.confidenceScore || 1.0
          );

          const candidate = await this.saveCandidate(profile, sourceMetadata);
          
          await this.enqueueEmbeddings(candidate);
          
          await this.enqueueEnrichment(candidate);

          sourceMetadata.ingestionStatus = "completed";
          sourceMetadata.candidateId = candidate._id;
          await sourceMetadata.save();

          results.push({
            candidate: candidate._id,
            source: sourceMetadata._id,
            status: "success"
          });

          this.stats.totalProcessed++;
        } catch (error) {
          console.error("Error processing profile:", error);
          this.stats.totalErrors++;
          results.push({
            profile: profile.email || profile.name,
            status: "error",
            error: error.message
          });
        }
      }

      this.status = "completed";
      return {
        success: true,
        results,
        stats: this.stats
      };
    } catch (error) {
      this.status = "failed";
      console.error(`Error in connector ${this.name}:`, error);
      throw error;
    }
  }

  async testConnection() {
    try {
      await this.fetchProfiles({ limit: 1 });
      return { success: true, message: "Connection test successful" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  getStatus() {
    return {
      name: this.name,
      status: this.status,
      lastRun: this.lastRun,
      stats: this.stats
    };
  }

  resetStats() {
    this.stats = {
      totalFetched: 0,
      totalProcessed: 0,
      totalDeduplicated: 0,
      totalSaved: 0,
      totalErrors: 0
    };
  }
}

export default SourceConnector;
