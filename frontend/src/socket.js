import { io } from "socket.io-client";

// const socket = io("http://localhost:4000"); 
const socket = io("http://localhost:4000", {
    transports: ["websocket"], // ✅ Force WebSocket instead of polling
  });
export default socket;
