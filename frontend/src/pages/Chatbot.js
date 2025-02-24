import React, { useState, useEffect, useRef } from "react";
import {
  IconButton,
  Typography,
  Button,
  TextareaAutosize,
  Paper,
  Box,
  Card,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { handleError } from "../utils";

function Chatbot({ open, onClose }) {
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const handleSubmit = async () => {
    if (!userMessage.trim()) return;

    const newMessages = [...messages, { sender: "user", message: userMessage }];
    setMessages(newMessages);
    setUserMessage("");

    try {
      const response = await fetch("http://localhost:8080/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userMessage }),
      });

      const result = await response.json();
      if (result.success) {
        setIsTyping(true);
        setTimeout(() => {
          setMessages([...newMessages, { sender: "ai", message: result.response }]);
          setIsTyping(false);
        }, 1000);
      } else {
        handleError(result.message || "Error fetching response");
      }
    } catch (error) {
      console.error("Error:", error);
      handleError("An error occurred while fetching AI response.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const formatMessage = (message) => {
    let formattedMessage = message.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    formattedMessage = formattedMessage
      .replace(/^\*\s/gm, "• ")
      .replace(/^\d+\.\s/gm, (match) => `${match.trim()}. `);
    return formattedMessage.split("\n").map((line, index) => (
      <span key={index}>
        <span dangerouslySetInnerHTML={{ __html: line }} />
        <br />
      </span>
    ));
  };

  return (
    <Box
      sx={{
        position: "fixed",
        // top: 190,
        bottom:10,
        right: 20,
        width: 400,
        maxHeight: "90vh",
        display: open ? "block" : "none",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
        borderRadius: "16px",
        overflow: "hidden",
        backgroundColor: "white",
      }}
    >
      <Card elevation={4}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
             padding: "8px 16px",
            background: "linear-gradient(90deg, #6a1b9a, #9c27b0)",
            color: "white",
          }}
        >
          <Typography variant="h6">Get Advice</Typography>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Chat Messages */}
        <Box
          sx={{
            padding: 2,
            height: "50vh",
            overflowY: "auto",
            backgroundColor: "#f9f9f9",
          }}
        >
          {messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                marginBottom: 1.5,
              }}
            >
              <Paper
                elevation={3}
                sx={{
                  padding: 1.5,
                  maxWidth: "75%",
                  borderRadius: "12px",
                  backgroundColor: msg.sender === "user" ? "#d1c4e9" : "#ffffff",
                  color: msg.sender === "user" ? "#4a148c" : "#000000",
                }}
              >
                <Typography variant="body2">
                  {msg.sender === "ai" ? formatMessage(msg.message) : msg.message}
                </Typography>
              </Paper>
            </Box>
          ))}
          {isTyping && (
            <Box sx={{ textAlign: "left", color: "#888", marginBottom: 2 }}>
              <Typography variant="body2">Typing...</Typography>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input Area */}
        <Box sx={{ padding: 2, backgroundColor: "#fff", position: "relative" }}>
          <TextareaAutosize
            minRows={2}
            maxRows={4}
            placeholder="Type your message..."
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "100px",
              borderRadius: "8px",
              padding: "10px",
              border: "1px solid #ddd",
              fontSize: "16px",
              resize: "none",
              outline: "none",
               overflow: "auto",
              boxSizing: "border-box"
            }}
          />
           <IconButton
            sx={{
              position: "absolute",
              right: 16,
              top: "50%",
              transform: "translateY(-50%)", // Center the button horizontally
              color: "#6a1b9a",
            }}
            onClick={handleSubmit}
          >
            <SendIcon />
          </IconButton>
        </Box>
      

      </Card>
    </Box>
  );
}

export default Chatbot;

