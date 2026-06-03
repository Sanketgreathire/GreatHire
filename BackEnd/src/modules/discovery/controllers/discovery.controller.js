import {
  runConnectorService,
  getDiscoveryStatusService,
  
  getConnectorsServiceHandler,
  getConnectorStatusService,
  pauseConnectorService,
  resumeConnectorService,
  cancelIngestionService,
  retryFailedIngestionService,
  // getIngestionHistoryService,
  // getSourceStatsService,
  testConnectorService
} from "../services/connectorRegistry.service.js";

export const runConnector = async (req, res) => {
  try {
    const { connector } = req.params;
    const { options = {} } = req.body;

    const result = await runConnectorService(connector, options);

    return res.status(200).json({
      success: true,
      data: result,
      message: `Connector ${connector} started successfully`
    });
  } catch (error) {
    console.error(`Error running connector ${req.params.connector}:`, error);
    return res.status(500).json({
      success: false,
      message: "Failed to run connector",
      error: error.message
    });
  }
};

export const testConnector = async (req, res) => {
  try {
    const { connector } = req.params;
    const { config } = req.body;

    const result = await testConnectorService(connector, config);

    return res.status(200).json({
      success: true,
      data: result,
      message: `Connector ${connector} test completed`
    });
  } catch (error) {
    console.error(`Error testing connector ${req.params.connector}:`, error);
    return res.status(500).json({
      success: false,
      message: "Failed to test connector",
      error: error.message
    });
  }
};

export const getDiscoveryStatus = async (req, res) => {
  try {
    const status = await getDiscoveryStatusService();

    return res.status(200).json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error("Error getting discovery status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get discovery status",
      error: error.message
    });
  }
};

export const getDiscoveryStats = async (req, res) => {
  try {
    const stats = await getDiscoveryStatusService();

    return res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error("Error getting discovery stats:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get discovery stats",
      error: error.message
    });
  }
};

export const getConnectors = async (req, res) => {
  try {
    const connectors = await getConnectorsServiceHandler();

    return res.status(200).json({
      success: true,
      data: connectors
    });
  } catch (error) {
    console.error("Error getting connectors:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get connectors",
      error: error.message
    });
  }
};

export const getConnectorStatus = async (req, res) => {
  try {
    const { connector } = req.params;
    const status = await getConnectorStatusService(connector);

    return res.status(200).json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error(`Error getting connector status ${req.params.connector}:`, error);
    return res.status(500).json({
      success: false,
      message: "Failed to get connector status",
      error: error.message
    });
  }
};

export const pauseConnector = async (req, res) => {
  try {
    const { connector } = req.params;
    const result = await pauseConnectorService(connector);

    return res.status(200).json({
      success: true,
      data: result,
      message: `Connector ${connector} paused`
    });
  } catch (error) {
    console.error(`Error pausing connector ${req.params.connector}:`, error);
    return res.status(500).json({
      success: false,
      message: "Failed to pause connector",
      error: error.message
    });
  }
};

export const resumeConnector = async (req, res) => {
  try {
    const { connector } = req.params;
    const result = await resumeConnectorService(connector);

    return res.status(200).json({
      success: true,
      data: result,
      message: `Connector ${connector} resumed`
    });
  } catch (error) {
    console.error(`Error resuming connector ${req.params.connector}:`, error);
    return res.status(500).json({
      success: false,
      message: "Failed to resume connector",
      error: error.message
    });
  }
};

export const cancelIngestion = async (req, res) => {
  try {
    const { jobId } = req.params;
    const result = await cancelIngestionService(jobId);

    return res.status(200).json({
      success: true,
      data: result,
      message: `Ingestion job ${jobId} cancelled`
    });
  } catch (error) {
    console.error(`Error cancelling ingestion ${req.params.jobId}:`, error);
    return res.status(500).json({
      success: false,
      message: "Failed to cancel ingestion",
      error: error.message
    });
  }
};

export const retryFailedIngestion = async (req, res) => {
  try {
    const { jobId } = req.params;
    const result = await retryFailedIngestionService(jobId);

    return res.status(200).json({
      success: true,
      data: result,
      message: `Ingestion job ${jobId} retry started`
    });
  } catch (error) {
    console.error(`Error retrying ingestion ${req.params.jobId}:`, error);
    return res.status(500).json({
      success: false,
      message: "Failed to retry ingestion",
      error: error.message
    });
  }
};



export const getSourceStats = async (req, res) => {
  try {
    const { connector, timeRange = '24h' } = req.query;
    const stats = await getSourceStatsService({ connector, timeRange });

    return res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error("Error getting source stats:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get source stats",
      error: error.message
    });
  }
};
