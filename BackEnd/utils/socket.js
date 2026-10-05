// let ioInstance = null;

// export const setIO = (io) => {
//   ioInstance = io;
//   console.log("✅ Socket.IO instance set successfully");
// };

// export const getIO = () => {
//   if (!ioInstance) {
//     console.warn("⚠️ Socket.IO not initialized - notifications will be stored but not sent in real-time");
//     return null;
//   }
//   return ioInstance;
// };

let ioInstance = null;

// Real-time online mapping: { userId: socketId }
const userSocketMap = {};

export const setIO = (io) => {
  ioInstance = io;
  console.log("✅ Socket.IO instance set successfully");

  ioInstance.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId && userId !== "undefined" && userId !== "null") {
      userSocketMap[userId.toString()] = socket.id;
      console.log(`🟢 User connected: ${userId}`);
    }

    // Connect hote hi sabhi users ko online array bhejein
    ioInstance.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      if (userId && userSocketMap[userId.toString()]) {
        delete userSocketMap[userId.toString()];
        console.log(`🔴 User disconnected: ${userId}`);
      }
      // Disconnect hone par dobara updated online array broadcast karein
      ioInstance.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });
};

export const getIO = () => {
  if (!ioInstance) {
    console.warn("⚠️ Socket.IO not initialized");
    return null;
  }
  return ioInstance;
};

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId?.toString()] || null;
};