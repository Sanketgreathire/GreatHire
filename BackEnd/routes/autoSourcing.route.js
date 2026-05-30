import express from 'express';
import { AutoSourcingConfig } from '../models/sourcing/autoSourcingConfig.model.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import isAdmin from '../middlewares/isAdmin.js';
import { triggerAutoSourcing } from '../sourcing/cron/autoSourcingCron.js';

const router = express.Router();

/**
 * GET /api/v1/auto-sourcing/config
 * Get auto-sourcing configuration for current recruiter
 */
router.get('/config', isAuthenticated, async (req, res) => {
  try {
    let config = await AutoSourcingConfig.findOne({ recruiterId: req.id });
    
    // Create default config if doesn't exist
    if (!config) {
      config = await AutoSourcingConfig.create({
        recruiterId: req.id,
        enabled: true,
      });
    }
    
    res.json({ success: true, config });
  } catch (error) {
    console.error('Get config error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch configuration' });
  }
});

/**
 * PUT /api/v1/auto-sourcing/config
 * Update auto-sourcing configuration
 */
router.put('/config', isAuthenticated, async (req, res) => {
  try {
    const { enabled, criteria } = req.body;
    
    const config = await AutoSourcingConfig.findOneAndUpdate(
      { recruiterId: req.id },
      {
        $set: {
          enabled,
          'criteria.platforms': criteria?.platforms,
          'criteria.languages': criteria?.languages,
          'criteria.locations': criteria?.locations,
          'criteria.keywords': criteria?.keywords,
          'criteria.minRepos': criteria?.minRepos,
          'criteria.minFollowers': criteria?.minFollowers,
          'criteria.minExperience': criteria?.minExperience,
          'criteria.maxCandidatesPerRun': criteria?.maxCandidatesPerRun,
        },
      },
      { upsert: true, new: true }
    );
    
    res.json({ success: true, config, message: 'Configuration updated successfully' });
  } catch (error) {
    console.error('Update config error:', error);
    res.status(500).json({ success: false, message: 'Failed to update configuration' });
  }
});

/**
 * GET /api/v1/auto-sourcing/stats
 * Get auto-sourcing statistics
 */
router.get('/stats', isAuthenticated, async (req, res) => {
  try {
    const config = await AutoSourcingConfig.findOne({ recruiterId: req.id });
    
    if (!config) {
      return res.json({
        success: true,
        stats: {
          totalRuns: 0,
          totalImported: 0,
          totalSkipped: 0,
          lastRunAt: null,
          lastRunResult: null,
        },
      });
    }
    
    res.json({ success: true, stats: config.stats });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch statistics' });
  }
});

/**
 * POST /api/v1/auto-sourcing/trigger
 * Manually trigger auto-sourcing (admin only)
 */
router.post('/trigger', isAuthenticated, isAdmin, async (req, res) => {
  try {
    // Trigger in background
    triggerAutoSourcing()
      .then(results => console.log('Manual auto-sourcing completed:', results))
      .catch(err => console.error('Manual auto-sourcing failed:', err));
    
    res.json({ 
      success: true, 
      message: 'Auto-sourcing triggered successfully. Check logs for progress.' 
    });
  } catch (error) {
    console.error('Trigger error:', error);
    res.status(500).json({ success: false, message: 'Failed to trigger auto-sourcing' });
  }
});

/**
 * PUT /api/v1/auto-sourcing/global-config
 * Update platforms for all recruiters (admin only)
 */
router.put('/global-config', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { platforms } = req.body;
    
    if (!platforms || !Array.isArray(platforms)) {
      return res.status(400).json({ success: false, message: 'Invalid platforms array' });
    }
    
    // Update all configs
    const result = await AutoSourcingConfig.updateMany(
      {},
      { $set: { 'criteria.platforms': platforms } }
    );
    
    res.json({ 
      success: true, 
      message: `Updated ${result.modifiedCount} recruiter configs with platforms: ${platforms.join(', ')}`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Update global config error:', error);
    res.status(500).json({ success: false, message: 'Failed to update global configuration' });
  }
});

export default router;
