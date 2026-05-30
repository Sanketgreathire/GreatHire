/**
 * logger.js
 * Centralized logging utility for JD matching pipeline.
 * Logs to console and can be extended to log to external services (ELK, DataDog, etc.)
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO:  1,
  WARN:  2,
  ERROR: 3,
};

class Logger {
  constructor(level = "INFO") {
    this.level = LOG_LEVELS[level] || LOG_LEVELS.INFO;
  }

  _format(levelName, module, message, data = {}) {
    const timestamp = new Date().toISOString();
    return {
      timestamp,
      level: levelName,
      module,
      message,
      ...data,
    };
  }

  debug(module, message, data) {
    if (this.level <= LOG_LEVELS.DEBUG) {
      console.debug(JSON.stringify(this._format("DEBUG", module, message, data)));
    }
  }

  info(module, message, data) {
    if (this.level <= LOG_LEVELS.INFO) {
      console.log(JSON.stringify(this._format("INFO", module, message, data)));
    }
  }

  warn(module, message, data) {
    if (this.level <= LOG_LEVELS.WARN) {
      console.warn(JSON.stringify(this._format("WARN", module, message, data)));
    }
  }

  error(module, message, error = null, data = {}) {
    if (this.level <= LOG_LEVELS.ERROR) {
      const logData = {
        ...data,
        ...(error instanceof Error && {
          errorName: error.name,
          errorMessage: error.message,
          errorStack: error.stack,
        }),
      };
      console.error(JSON.stringify(this._format("ERROR", module, message, logData)));
    }
  }

  // Convenience methods for common modules
  jdParse(message, data) { this.info("jd-parser", message, data); }
  jdEmbed(message, data) { this.info("jd-embedding", message, data); }
  matching(message, data) { this.info("candidate-matching", message, data); }
  pipeline(message, data) { this.info("matching-pipeline", message, data); }
  ranking(message, data) { this.info("hybrid-ranking", message, data); }
  feedback(message, data) { this.info("recruiter-feedback", message, data); }
  queue(message, data) { this.info("jd-queue", message, data); }
  api(message, data) { this.info("jd-api", message, data); }
}

export default new Logger(process.env.LOG_LEVEL || "INFO");
