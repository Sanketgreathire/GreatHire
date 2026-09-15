import { Application } from "../models/application.model.js";
import StageHistory from "../models/stageHistory.model.js";

// Ordered, linear happy-path of the recruitment pipeline.
export const STAGE_ORDER = [
  "Application",
  "Screening",
  "Shortlisted",
  "Interview",
  "Selected",
  "Joined",
];

// Terminal stages. Once here, an application cannot move anywhere else.
export const TERMINAL_STAGES = ["Rejected", "Closed"];

export const ALL_STAGES = [...STAGE_ORDER, ...TERMINAL_STAGES];

// Best-effort mapping so the legacy flat `status` field (used by the old
// updateStatus endpoint / older frontend code) keeps working while the app
// migrates to the `recruitmentStatus` FSM below.
export const LEGACY_STATUS_TO_STAGE = {
  Pending: "Application",
  "Interview Schedule": "Interview",
  Shortlisted: "Shortlisted",
  Rejected: "Rejected",
};

export const STAGE_TO_LEGACY_STATUS = {
  Application: "Pending",
  Screening: "Pending",
  Shortlisted: "Shortlisted",
  Interview: "Interview Schedule",
  Selected: "Interview Schedule",
  Joined: "Interview Schedule",
  Rejected: "Rejected",
  Closed: "Rejected",
};

const isTerminalStage = (stage) => TERMINAL_STAGES.includes(stage);

/**
 * Checks whether moving from currentStage -> newStage is a legal FSM move.
 *
 * Rules:
 *  - A terminal stage (Rejected/Closed) can never move anywhere else.
 *  - Any active (non-terminal) stage can be closed out to a terminal stage
 *    (Rejected/Closed) at any point in the pipeline.
 *  - Otherwise the move must advance exactly one step forward in
 *    STAGE_ORDER — no skipping stages, and no moving backward.
 */
export const isValidTransition = (currentStage, newStage) => {
  if (!ALL_STAGES.includes(newStage)) return false;
  if (currentStage === newStage) return false;
  if (isTerminalStage(currentStage)) return false;
  if (isTerminalStage(newStage)) return true;

  const currentIndex = STAGE_ORDER.indexOf(currentStage);
  const newIndex = STAGE_ORDER.indexOf(newStage);
  if (currentIndex === -1 || newIndex === -1) return false;

  return newIndex === currentIndex + 1;
};

/**
 * Moves an application to a new recruitment stage.
 * - Validates the transition against the FSM rules above.
 * - Updates application.recruitmentStatus (and the legacy `status` field).
 * - Writes a StageHistory row for every successful change.
 *
 * Throws an Error with a `.statusCode` set (400/404) on invalid input.
 */
export const transitionStage = async (applicationId, newStage, actorId) => {
  if (!applicationId) {
    const err = new Error("applicationId is required.");
    err.statusCode = 400;
    throw err;
  }
  if (!actorId) {
    const err = new Error("actorId is required.");
    err.statusCode = 400;
    throw err;
  }
  if (!newStage || !ALL_STAGES.includes(newStage)) {
    const err = new Error(
      `Invalid stage "${newStage}". Valid stages: ${ALL_STAGES.join(", ")}`
    );
    err.statusCode = 400;
    throw err;
  }

  const application = await Application.findById(applicationId);
  if (!application) {
    const err = new Error("Application not found.");
    err.statusCode = 404;
    throw err;
  }

  const currentStage = application.recruitmentStatus || "Application";

  if (!isValidTransition(currentStage, newStage)) {
    const err = new Error(
      `Invalid transition: cannot move from "${currentStage}" to "${newStage}".`
    );
    err.statusCode = 400;
    throw err;
  }

  application.recruitmentStatus = newStage;
  if (STAGE_TO_LEGACY_STATUS[newStage]) {
    application.status = STAGE_TO_LEGACY_STATUS[newStage];
  }
  await application.save();

  const historyEntry = await StageHistory.create({
    application: applicationId,
    fromStage: currentStage,
    toStage: newStage,
    changedBy: actorId,
  });

  return { application, historyEntry };
};

/**
 * Returns the full, chronological StageHistory for an application.
 */
export const getStageHistory = async (applicationId) => {
  return StageHistory.find({ application: applicationId })
    .sort({ changedAt: 1 })
    .populate("changedBy", "fullname email");
};

/**
 * Computes how many days the application has spent in its current stage,
 * based on the most recent StageHistory entry. Falls back to the
 * application's createdAt if it has never transitioned (still in the
 * default "Application" stage).
 */
export const getCandidateAging = async (applicationId) => {
  const latestEntry = await StageHistory.findOne({ application: applicationId })
    .sort({ changedAt: -1 })
    .lean();

  let since;
  let stage;

  if (latestEntry) {
    since = latestEntry.changedAt || latestEntry.createdAt;
    stage = latestEntry.toStage;
  } else {
    const application = await Application.findById(applicationId).lean();
    if (!application) {
      const err = new Error("Application not found.");
      err.statusCode = 404;
      throw err;
    }
    since = application.createdAt;
    stage = application.recruitmentStatus || "Application";
  }

  const daysInStage = Math.floor(
    (Date.now() - new Date(since).getTime()) / (1000 * 60 * 60 * 24)
  );

  return { stage, since, daysInStage };
};
