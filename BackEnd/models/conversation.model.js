import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    lastMessageTime: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // For group conversations (future enhancement)
    isGroup: {
      type: Boolean,
      default: false,
    },
    groupName: {
      type: String,
      trim: true,
    },
    // Track unread counts per participant
    unreadCounts: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

// Index for efficient queries
conversationSchema.index({ participants: 1 });
conversationSchema.index({ lastMessageTime: -1 });

// Method to get other participant in a direct conversation
conversationSchema.methods.getOtherParticipant = function(currentUserId) {
  return this.participants.find(p => p.toString() !== currentUserId.toString());
};

// Method to increment unread count for a user
conversationSchema.methods.incrementUnreadCount = function(userId) {
  const currentCount = this.unreadCounts.get(userId.toString()) || 0;
  this.unreadCounts.set(userId.toString(), currentCount + 1);
  return this.save();
};

// Method to reset unread count for a user
conversationSchema.methods.resetUnreadCount = function(userId) {
  this.unreadCounts.set(userId.toString(), 0);
  return this.save();
};

export const Conversation = mongoose.model("Conversation", conversationSchema);
