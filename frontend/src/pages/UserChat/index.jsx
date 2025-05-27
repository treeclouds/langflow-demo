// src/pages/UserChat.jsx
import { useNavigate, useParams } from 'react-router-dom';
import {ChatWindow} from '../../components';
import React, { useEffect } from 'react';

const UserChat = () => {
  const { id } = useParams();
   const navigate = useNavigate();

   useEffect(() => {
    const storedData = localStorage.getItem("personal_data");

    if (!storedData) {
      navigate("/login");
      return;
    }

    // Adjust this based on how you store user ID in localStorage
    if (storedData !== id) {
      navigate("/forbidden");
      localStorage.clear();
    }
  }, [id, navigate]);
  return (
    <div style={{ padding: "2rem" }}>
      <ChatWindow />
    </div>
  );
};

export default UserChat;
