// RoomSummary.jsx
import { useEffect, useState } from "react";
import socket from "../../socket";
import ReactMarkdown from "react-markdown";
import { RoomSummaryContainer, Button, MarkdownContainer } from "./element";

function RoomSummary({ roomId }) {
 
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);
    const handleSummarize = () => {
      if (!roomId) return;
      setLoading(true);
      socket.emit("summarize-room", roomId);
    };

  useEffect(() => {
    setSummary("");
    socket.on("room-summary", ({ roomId: returnedRoomId, summary }) => {
      if (returnedRoomId === roomId) {
        setSummary(summary);
        setLoading(false);
      }
    });

    return () => {
      socket.off("room-summary");
    };
  }, [roomId]);

  return (
    <RoomSummaryContainer>
      <Button onClick={handleSummarize}>{loading?"loading..":"Summarize Conversation"}</Button>
      <MarkdownContainer>
        <ReactMarkdown>
          {summary ? summary : "No summary available yet."}
        </ReactMarkdown>
      </MarkdownContainer>
    </RoomSummaryContainer>
  );
}

export default RoomSummary;
