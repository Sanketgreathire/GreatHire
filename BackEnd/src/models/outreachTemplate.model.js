import mongoose from "mongoose";

const outreachTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  outreachType: {
    type: String,
    enum: ["email", "linkedin", "followup", "cold"],
    required: true
  },
  tone: {
    type: String,
    enum: ["professional", "startup_casual", "aggressive_hiring", "executive_hiring"],
    required: true
  },
  template: {
    type: String,
    required: true,
    maxlength: 5000
  },
  subjectTemplate: {
    type: String,
    maxlength: 200
  },
  variables: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    type: {
      type: String,
      enum: ["text", "number", "boolean", "array"],
      default: "text"
    },
    required: {
      type: Boolean,
      default: false
    },
    defaultValue: {
      type: mongoose.Schema.Types.Mixed
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  usageCount: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  tags: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  archivedAt: Date
}, {
  timestamps: true,
  collection: "outreachtemplates"
});

outreachTemplateSchema.index({ createdBy: 1, createdAt: -1 });
outreachTemplateSchema.index({ outreachType: 1, tone: 1 });
outreachTemplateSchema.index({ isPublic: 1, createdAt: -1 });
outreachTemplateSchema.index({ "rating.average": -1 });
outreachTemplateSchema.index({ usageCount: -1 });

outreachTemplateSchema.methods.incrementUsage = function() {
  this.usageCount += 1;
  return this.save();
};

outreachTemplateSchema.methods.updateRating = function(newRating) {
  const currentTotal = this.rating.average * this.rating.count;
  this.rating.count += 1;
  this.rating.average = (currentTotal + newRating) / this.rating.count;
  return this.save();
};

outreachTemplateSchema.methods.archive = function() {
  this.isActive = false;
  this.archivedAt = new Date();
  return this.save();
};

outreachTemplateSchema.methods.validateTemplate = function(candidateContext, jobContext, recruiterContext) {
  const errors = [];
  const template = this.template;
  const subjectTemplate = this.subjectTemplate || '';

  const allVariables = new Set();
  const templateMatches = template.match(/\{\{([^}]+)\}\}/g) || [];
  const subjectMatches = subjectTemplate.match(/\{\{([^}]+)\}\}/g) || [];

  templateMatches.forEach(match => {
    const variable = match.slice(2, -2);
    allVariables.add(variable);
  });

  subjectMatches.forEach(match => {
    const variable = match.slice(2, -2);
    allVariables.add(variable);
  });

  const requiredVariables = this.variables.filter(v => v.required).map(v => v.name);

  requiredVariables.forEach(variable => {
    if (!allVariables.has(variable)) {
      errors.push(`Required variable '{{${variable}}}' is not used in template`);
    }
  });

  allVariables.forEach(variable => {
    const templateVar = this.variables.find(v => v.name === variable);
    if (!templateVar) {
      errors.push(`Variable '{{${variable}}}' is not defined in template variables`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    usedVariables: Array.from(allVariables)
  };
};

outreachTemplateSchema.methods.renderTemplate = function(context) {
  let template = this.template;
  let subjectTemplate = this.subjectTemplate || '';

  this.variables.forEach(variable => {
    const value = context[variable.name] || variable.defaultValue || '';
    const regex = new RegExp(`\\{\\{${variable.name}\\}\\}`, 'g');
    template = template.replace(regex, value);
    subjectTemplate = subjectTemplate.replace(regex, value);
  });

  return {
    message: template,
    subject: subjectTemplate
  };
};

outreachTemplateSchema.statics.getPopularTemplates = async function(limit = 10) {
  return this.find({ isActive: true })
    .sort({ usageCount: -1, "rating.average": -1 })
    .limit(limit)
    .populate('createdBy', 'fullName')
    .lean();
};

outreachTemplateSchema.statics.getPublicTemplates = async function(filters = {}) {
  const query = { isPublic: true, isActive: true };
  
  if (filters.outreachType) query.outreachType = filters.outreachType;
  if (filters.tone) query.tone = filters.tone;
  
  return this.find(query)
    .sort({ "rating.average": -1, usageCount: -1 })
    .populate('createdBy', 'fullName')
    .lean();
};

outreachTemplateSchema.statics.searchTemplates = async function(searchTerm, recruiterId, limit = 20) {
  const query = {
    isActive: true,
    $or: [
      { createdBy: recruiterId },
      { isPublic: true }
    ],
    $text: { $search: searchTerm }
  };
  
  return this.find(query, { score: { $meta: "textScore" } })
    .sort({ score: { $meta: "textScore" } })
    .limit(limit)
    .populate('createdBy', 'fullName')
    .lean();
};

const OutreachTemplate = mongoose.model("OutreachTemplate", outreachTemplateSchema);

export default OutreachTemplate;
