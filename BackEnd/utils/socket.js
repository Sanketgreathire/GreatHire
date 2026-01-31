let ioInstance = null;

export const setIO = (io) => {
  ioInstance = io;
  console.log("✅ Socket.IO instance set successfully");
};

export const getIO = () => {
  if (!ioInstance) {
    console.warn("⚠️ Socket.IO not initialized - notifications will be stored but not sent in real-time");
    return null;
  }
  return ioInstance;
};