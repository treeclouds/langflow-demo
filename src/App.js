import "./App.css";
import { Admin, Home, SummarizePDF, UserChat } from "./pages";
import React, { useRef, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.setAttribute("window_title", "NIX Customer Service");
      chatRef.current.setAttribute(
        "flow_id",
        "cb8db5f4-f987-4d99-88fc-0b9bae8bfd7e"
      );
      chatRef.current.setAttribute("host_url", "https://langflow.bawana.com");

      const apiKey = process.env.REACT_APP_LANGFLOW_API_KEY;
      if (apiKey) {
        chatRef.current.setAttribute("api_key", apiKey);
      } else {
        console.warn("Langflow API Key is missing!");
      }
    }
  }, []);
  return (
    <div className="App">
      <div>
        <langflow-chat ref={chatRef}></langflow-chat>
      </div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/user/:id" element={<UserChat />} />
          <Route path="/summarize-pdf" element={<SummarizePDF />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
