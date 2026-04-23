import { Server } from "socket.io";
import http from "http";
import express from "express";
import app from "../app.js";

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; //{userId: socket.id}

io.use((socket, next) => {
  const userId = socket.handshake.query.userId;

  if (!userId) return next(new Error("No userId"));

  socket.userId = userId;
  next();
});

io.on("connection", (socket) => {
  console.log("a user Connect", socket.id);

  userSocketMap[socket.userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("a user disconnect", socket.id);
    delete userSocketMap[socket.userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { server, io };
