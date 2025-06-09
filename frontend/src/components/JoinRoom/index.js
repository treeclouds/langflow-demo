import React, { useState } from "react";
import { Room, RoomEvent, connect } from "livekit-client";
import axios from "axios";

const JoinRoom = () => {
  const [identity, setIdentity] = useState("user123");
  const [roomName, setRoomName] = useState("demo-room");
  const [room, setRoom] = useState(null);

  const handleJoin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/token",
        { identity, room: roomName },
        { withCredentials: true }
      );

      const token = res.data.token;

      const room = new Room();
      await connect(room, "wss://your-livekit-domain", token); // 🔁 Replace with your actual LiveKit URL
      console.log("✅ Connected to LiveKit");

      room.on(RoomEvent.ParticipantConnected, participant => {
        console.log("🔔 New participant:", participant.identity);
      });

      setRoom(room);
    } catch (err) {
      console.error("❌ Error joining room:", err);
    }
  };

  return (
    <div>
      <input
        value={identity}
        onChange={(e) => setIdentity(e.target.value)}
        placeholder="Your name"
      />
      <input
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        placeholder="Room name"
      />
      <button onClick={handleJoin}>Join Room</button>
    </div>
  );
};

export default JoinRoom;
