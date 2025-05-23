const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const axios = require("axios");
const { loadChatHistory, saveChatHistory } = require("./storage");
const app = express();
const db = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST"]
}));

app.use(express.json());
app.use(cookieParser());

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const existingUser = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
  if (existingUser) {
    return res.status(400).json({ message: "Username already taken!" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  db.prepare("INSERT INTO users (username, password) VALUES (?, ?)").run(username, hashedPassword);

  res.json({ message: "✅ Registered successfully!" });
});
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
  if (!user) {
    return res.status(401).json({ message: "❌ User not found" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "❌ Invalid password" });
  }

  const token = jwt.sign({ username: user.username }, "your_secret_key", { expiresIn: "1h" });
  res.cookie("token_user_key", token, {
    httpOnly: true,
    secure: false
  });

  res.json({ message: "✅ Login successful!" });
});
app.get("/me", (req, res) => {
  const token = req.cookies.token_user_key;
  if (!token) return res.status(401).json({ message: "Not logged in" });

  try {
    const user = jwt.verify(token, "your_secret_key");
    res.json({ message: `You are logged in as ${user.username}` });
  }catch (err) {
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ message: "Session expired, please login again." });
  }
  return res.status(401).json({ message: "Invalid token" });
}
});
app.post("/logout", (req, res) => {
  res.clearCookie("token_user_key");
  res.json({ message: "✅ Logged out successfully!" });
});
app.get("/users", (req, res) => {
  try {
    const users = db.prepare("SELECT username FROM users").all();
    res.json(users);
  } catch (err) {
    console.error("❌ Error fetching users:", err.message);
    res.status(500).json({ message: "Error fetching users" });
  }
});

require("dotenv").config();

// ✅ Basic env checks
if (!process.env.LANGFLOW_URL || !process.env.LANGFLOW_API_KEY || !process.env.LANGFLOW_URL_EMOTION) {
  console.error("❌ Missing required environment variables.");
  process.exit(1);
}



let chatHistory = loadChatHistory();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    credentials: true, // ✅ here too!
    methods: ["GET", "POST"]
  }
});

let ongoingLangflowRequest = null;
const roomInterruptStatus = {};
const adminInterruptStatus = {};

// ✅ Helper to get public rooms
const getActiveRooms = () => {
  const rooms = [];
  const sockets = io.sockets.adapter.sids;
  const allRooms = io.sockets.adapter.rooms;

  for (let [roomName, roomSockets] of allRooms) {
    if (!sockets.has(roomName)) {
      rooms.push(roomName);
    }
  }

  return rooms;
};

io.on("connection", (socket) => {
  console.log("✅ New client connected:", socket.id);

  socket.on("get-rooms", () => {
    const rooms = getActiveRooms();
    socket.emit("room-list", rooms);
  });

  socket.on("join-room", (roomId) => {
    if (!roomId || typeof roomId !== "string") return;
    socket.join(roomId);
    chatHistory[roomId] = chatHistory[roomId] || [];
    socket.emit("chat-history", chatHistory[roomId]);
    console.log(`👁️ Admin ${socket.id} joined room: ${roomId}`);
  });

  socket.on("admin-interrupt-toggle", ({ roomId, isInterrupting }) => {
    if (typeof roomId !== "string" || typeof isInterrupting !== "boolean") return;
    roomInterruptStatus[roomId] = isInterrupting;
    console.log(`🔁 Admin ${socket.id} interrupt status for room ${roomId}: ${isInterrupting}`);
  });

  socket.on("chat-message", async (msg) => {
    try {
      if (!msg || !msg.text || typeof msg.text !== "string" || !msg.roomId) return;

      console.log("💬 Incoming message:", msg);
      socket.join(msg.roomId);
      io.to(msg.roomId).emit("typing", { from: msg.from, typing: true });

      chatHistory[msg.roomId] = chatHistory[msg.roomId] || [];
      chatHistory[msg.roomId].push(msg);
      saveChatHistory(chatHistory);

      io.to(msg.roomId).emit("chat-message", msg);

      const rooms = getActiveRooms();
      io.emit("room-list", rooms);

      if (msg.from === "admin" && ongoingLangflowRequest?.cancel) {
        console.log("🛑 Cancelling ongoing Langflow request...");
        io.to(msg.roomId).emit("typing", { from: "admin", typing: false });
        ongoingLangflowRequest.cancel("Interrupted by new message");
        ongoingLangflowRequest = null;
        return;
      }

      if (msg.from !== "user" || roomInterruptStatus[msg.roomId]) {
        if (msg.from === "admin") {
          io.to(msg.roomId).emit("typing", { from: "admin", typing: false });
        }
        return;
      }

      const CancelToken = axios.CancelToken;
      const source = CancelToken.source();
      ongoingLangflowRequest = source;

      io.to(msg.roomId).emit("typing", { from: "ai", typing: true });

      const response = await axios.post(
        process.env.LANGFLOW_URL,
        {
          input_value: msg.text,
          output_type: "chat",
          input_type: "chat",
          tweaks: {
            "File-o3QkD": {},
            "ParseData-yY0Ub": {},
            "Prompt-1eccd": {},
            "ChatInput-L83nO": {},
            "OpenAIModel-ppjvf": {},
            "ChatOutput-IwChK": {},
          }
        },
        {
          headers: {
            "x-api-key": process.env.LANGFLOW_API_KEY,
            "Content-Type": "application/json",
          },
          cancelToken: source.token
        }
      );

      const data = response.data;
      const replyText =
        data?.outputs?.[0]?.outputs?.[0]?.artifacts?.message ||
        data?.outputs?.[0]?.outputs?.[0]?.outputs?.message?.message ||
        "No output.";

      const emotionResponse = await axios.post(
        process.env.LANGFLOW_URL_EMOTION,
        {
          input_value: msg.text,
          output_type: "chat",
          input_type: "chat"
        },
        {
          headers: {
            "x-api-key": process.env.LANGFLOW_API_KEY,
            "Content-Type": "application/json",
          }
        }
      );

      const emotionData = emotionResponse.data;
      const detectedEmotion =
        emotionData?.outputs?.[0]?.outputs?.[0]?.artifacts?.message ||
        emotionData?.outputs?.[0]?.outputs?.[0]?.outputs?.message?.message ||
        "No emotion detected.";

      const aiReply = {
        from: "ai",
        text: replyText,
        emotion: detectedEmotion,
        roomId: msg.roomId,
        timestamp: new Date().toISOString(),
      };

      chatHistory[msg.roomId].push(aiReply);
      saveChatHistory(chatHistory);
      io.to(msg.roomId).emit("typing", { from: "ai", typing: false });
      io.to(msg.roomId).emit("chat-message", aiReply);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("❌ Langflow request canceled.");
      } else {
        console.error("❌ Langflow error:", error.message);
        io.to(msg.roomId).emit("chat-message", {
          from: "ai",
          text: "Langflow error: " + error.message
        });
      }
    } finally {
      ongoingLangflowRequest = null;
    }
  });

  socket.on("summarize-room", async (roomId) => {
    try {
      if (!roomId || typeof roomId !== "string") return;
      const messages = chatHistory[roomId] || [];
      const fullConversation = messages.map(m => `${m.from}: ${m.text}`).join("\n");

      const response = await axios.post(
        process.env.LANGFLOW_URL,
        {
          input_value: `Please summarize the conversation:\n${fullConversation}`,
          output_type: "chat",
          input_type: "chat",
          tweaks: {
            "File-o3QkD": {},
            "ParseData-yY0Ub": {},
            "Prompt-1eccd": {},
            "ChatInput-L83nO": {},
            "OpenAIModel-ppjvf": {},
            "ChatOutput-IwChK": {},
          }
        },
        {
          headers: {
            "x-api-key": process.env.LANGFLOW_API_KEY,
            "Content-Type": "application/json",
          }
        }
      );

      const summary =
        response?.data?.outputs?.[0]?.outputs?.[0]?.artifacts?.message ||
        response?.data?.outputs?.[0]?.outputs?.[0]?.outputs?.message?.message ||
        "No summary generated.";

      socket.emit("room-summary", { roomId, summary });
    } catch (error) {
      console.error("❌ Error summarizing room:", error.message);
      socket.emit("room-summary", {
        roomId,
        summary: `Error summarizing chat: ${error.message}`
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
    delete adminInterruptStatus[socket.id];
    Object.keys(roomInterruptStatus).forEach(roomId => {
      if (roomInterruptStatus[roomId] === socket.id) {
        delete roomInterruptStatus[roomId];
      }
    });
  });
});

server.listen(4000, () => {
  console.log("🚀 Server running on http://localhost:4000");
});
