// src/pages/UserChat.jsx
import { useNavigate, useParams } from "react-router-dom";
import { ChatWindow } from "../../components";
import React, { useEffect, useState, useRef } from "react";
import { Room, useVoiceAssistant } from "livekit-client";
import axios from "axios";

async function fetchLiveKitToken(id, room) {
  try {
    const response = await axios.post("http://localhost:4000/api/token", {
      identity: id,
      room,
    });
    return response.data.token;
  } catch (error) {
    throw new Error("Failed to get token");
  }
}

async function getAIResponse(userText) {
  try {
    const res = await fetch(process.env.REACT_APP_URL, {
      method: "POST",
      headers: {
        "x-api-key": process.env.REACT_APP_LANGFLOW_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input_value: userText,
        output_type: "chat",
        input_type: "chat",
        tweaks: {
          "File-o3QkD": {},
          "ParseData-yY0Ub": {},
          "Prompt-1eccd": {},
          "ChatInput-L83nO": {},
          "OpenAIModel-ppjvf": {},
          "ChatOutput-IwChK": {},
        },
      }),
    });

    const data = await res.json();
    const responseText =
      data?.outputs?.[0]?.outputs?.[0]?.artifacts?.message ||
      data?.outputs?.[0]?.outputs?.[0]?.outputs?.message?.message ||
      "No output.";
    return new Promise((resolve) =>
      setTimeout(() => resolve(responseText), 300)
    );
  } catch (error) {
    console.error("Upload failed:", error);
    return "AI is currently unavailable. Please try again later.";
  }
}
const UserChat = () => {
  const [livekitRoom, setLivekitRoom] = useState(null);
  const room = "sbx-2dg2di-mkqQUmUvHyMNh7HJbREPNZ";
  const { id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("...");
  const recognitionRef = useRef(null);

  useEffect(() => {
    const roomInstance = new Room();

    async function init() {
      try {
        const token = await fetchLiveKitToken(id, room);
        const url = process.env.REACT_APP_LIVEKIT_URL;
        await roomInstance.connect(url, token);

        // Get mic and publish audio track
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const audioTrack = stream.getAudioTracks()[0];
        await roomInstance.localParticipant.publishTrack(audioTrack);
        setLivekitRoom(roomInstance);
      } catch (error) {
        console.error("LiveKit connection failed", error);
      }
    }

    init();

    return () => {
      roomInstance.disconnect();
    };
  }, [id, room]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("personal_data"));

    if (!storedData) {
      navigate("/login");
      return;
    }

    // Adjust this based on how you store user ID in localStorage
    if (storedData.username !== id) {
      navigate("/forbidden");
    }
  }, [id, navigate]);

  // Initialize SpeechRecognition once
  useEffect(() => {
    if (
      !("SpeechRecognition" in window) &&
      !("webkitSpeechRecognition" in window)
    ) {
      alert("SpeechRecognition API not supported in this browser.");
      return;
    }
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = "en-US";
    recognitionRef.current.interimResults = false;
    recognitionRef.current.maxAlternatives = 1;
  }, []);

  const handleSpeakClick = () => {
    if (!recognitionRef.current) return;

    // 1. Stop AI speech if it's still talking
    speechSynthesis.cancel();

    // 2. Optional: Reset status
    setStatus("Listening... Please speak.");

    // 3. Setup result handler
    recognitionRef.current.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("User said:", transcript);
      setStatus(transcript);

      // 4. Get AI reply
      const aiReply = await getAIResponse(transcript);
      setStatus(aiReply);

      // 5. Speak AI reply
      const utterance = new SpeechSynthesisUtterance(aiReply);
      utterance.lang = "en-US";

      // Reset status when speech ends
      utterance.onend = () => {
        setStatus("Click 'Speak' and talk.");
      };

      speechSynthesis.speak(utterance);
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setStatus("Error: " + event.error);
    };

    // 6. Start listening
    recognitionRef.current.start();
  };

  return (
    <div style={{ padding: "2rem" }}>
      {livekitRoom ? "Connected to LiveKit" : "Connecting..."}
      <h2>AI Virtual Assistant</h2>
      <p>Status: {status}</p>
      <button onClick={handleSpeakClick} disabled={!livekitRoom}>
        Speak
      </button>
      <ChatWindow />
    </div>
  );
};

export default UserChat;
