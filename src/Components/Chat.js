import React, { useState, useEffect, useRef, useCallback } from "react";
import { getData, postData, ServerURL } from "../services/ServerServices";
import "../stylesheet/Chat.css"; // Import CSS file for styling
import { useSelector } from "react-redux";
import SendIcon from "@mui/icons-material/Send";
import {
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  InputBase,
} from "@mui/material";
import io from "socket.io-client";

let socket;

const Chat = () => {
  const paperId = useSelector((state) => state.paper.id); // Accessing the paper ID from the Redux state
  const bottomOfChatRef = useRef(null);
  const chatMessagesRef = useRef(null);
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [viewerData, setViewerData] = useState([]);
  const [selectedViewerId, setSelectedViewerId] = useState(null);

  // console.log("chat viewer id", selectedViewerId);
  const fetchViewerData = useCallback(async () => {
    if (paperId !== null) {
      setLoading(true);
      try {
        const result = await postData("viewer/selectedviewer_info", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          paperId,
        });
        setViewerData(result.data);
        console.log("shared view data", result.data);
      } catch (error) {
        console.error("Error fetching viewer data:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [paperId]);

  useEffect(() => {
    fetchViewerData();
  }, [paperId]);

  useEffect(() => {
    fetchViewerData();
  }, [fetchViewerData]);

  useEffect(() => {
    // Initialize socket connection
    socket = io(`${ServerURL}/viewer-namespace`);

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (selectedViewerId) {
      socket.emit("fetch_comments", {
        viewer_id: selectedViewerId,
        paper_id: paperId,
        user: "admin",
      });
    }
  }, [selectedViewerId, paperId]);

  useEffect(() => {
    socket.on("comments", (msg) => {
      console.log("newComment", msg);
      const updatedComments = [...messages, ...msg];
      setMessages(updatedComments);
      scrollToBottom();
    });

    return () => {
      socket.off("comments");
    };
  }, []);

  const scrollToBottom = () => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  };

  // console.log("viewervdata", viewerData);

  const sendMessage = (messageText) => {
    if (!selectedViewerId) return;

    scrollToBottom();
    const body = {
      comment: messageText,
      is_admin_comment: "1",
      viewer_id: selectedViewerId,
      paper_id: paperId,
      user: "admin",
    };

    try {
      socket.emit("new_comment", body);
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputRef.current.value.trim()) {
      e.preventDefault();
      sendMessage(inputRef.current.value);
      inputRef.current.value = "";
    }
  };

  const handleSendClick = () => {
    if (inputRef.current.value.trim()) {
      sendMessage(inputRef.current.value);
      inputRef.current.value = "";
    }
  };

  return (
    <div className="chat-container">
      <div className="viewer-list">
        {viewerData.map((viewer) => (
          <div
            key={viewer.viewer_id}
            onClick={() => setSelectedViewerId(viewer.viewer_id)}
            className={`viewer ${
              selectedViewerId === viewer.viewer_id ? "active" : ""
            }`}
          >
            <div>
              {viewer.firstname} {viewer.lastname}
            </div>
          </div>
        ))}
      </div>
      <div className="chat">
        <div className="chat-header">Conversation</div>
        <div ref={chatMessagesRef} className="chat-messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${
                message.is_admin_comment === 1 ? "sent" : "received"
              }`}
             
              ref={index === messages.length - 1 ? bottomOfChatRef : null}
            >
              <div
                className="message-content"
                style={{
                  fontWeight:
                    message.content === "AcceptPaper"
                      ? "bold"
                      : message.content === "RejectPaper"
                      ? "bold"
                      : "normal",

                  textAlign: "left",
                  color:
                    message.content === "AcceptPaper"
                      ? "green"
                      : message.content === "RejectPaper"
                      ? "red"
                      : "black",
                 
                }}
              >
                {message.content}
              </div>

              <div className="message-timestamp">
                {new Date(message.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Paper
            elevation={3}
            component="form"
            onKeyDown={handleKeyDown}
            sx={{
              p: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50px",
            }}
          >
            <InputBase
              placeholder="Type a message"
              inputProps={{ "aria-label": "Type a message" }}
              inputRef={inputRef}
            />
            <IconButton
              onClick={handleSendClick}
              type="button"
              sx={{ p: "10px" }}
              aria-label="send"
            >
              <SendIcon />
            </IconButton>
          </Paper>
        </div>
      </div>
    </div>
  );
};

export default Chat;
