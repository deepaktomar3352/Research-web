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
  const viewerId = useSelector((state) => state.viewer.id);
  const bottomOfChatRef = useRef(null);
  const chatMessagesRef = useRef(null);
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [viewerData, setViewerData] = useState([]);
  const [notificationPaperId, setNotificationPaperId] = useState("");
  const [selectedViewerId, setSelectedViewerId] = useState(null);

  if (viewerId && viewerId !== selectedViewerId) {
    setSelectedViewerId(viewerId);
    setNotificationPaperId(viewerId);
    console.log("iiiiiiiiii", viewerId);
  }
  console.log("ddddddddddddd", viewerId);
  console.log("ssssssssss", selectedViewerId);
  console.log("pppppppp", paperId);

  // console.log("chat viewer id", selectedViewerId);
  const fetchViewerData = useCallback(async () => {
    const paper_id = paperId || notificationPaperId;

    if (paper_id) {
      const numericPaperId = Number(paper_id); // Convert to number if not already
      const body = { paper_id: numericPaperId }; // Create the body with paper_id as a number
  
      try {
        const result = await postData("viewer/selectedviewer_info", body);

        if (result && result.data) {
          setViewerData(result.data);
        } else {
          throw new Error("No data found in the response");
        }
      } catch (error) {
        console.error("Error fetching viewer data:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [paperId, notificationPaperId]);

  useEffect(() => {
    fetchViewerData();
  }, [paperId || notificationPaperId]);

  useEffect(() => {
    fetchViewerData();
  }, [fetchViewerData]);

  useEffect(() => {
    socket = io(`${ServerURL}/admin-namespace`);

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (selectedViewerId) {
      socket.emit("fetch_admin_comments", {
        viewer_id: selectedViewerId,
        paper_id: paperId || notificationPaperId,
        user: "viewer",
      });
    }
  }, [selectedViewerId, paperId]);

  useEffect(() => {
    socket.on("viewer_comments", (msg) => {
      console.log("viewer ki Comment", msg);
      const updatedComments = [...messages, ...msg];
      setMessages(updatedComments);
      // scrollToBottom();
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
      paper_id: paperId || notificationPaperId,
      user: "viewer",
    };

    try {
      socket.emit("new_comment", body);
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyDown = (e) => {
    scrollToBottom();
    if (e.key === "Enter" && inputRef.current.value.trim()) {
      e.preventDefault();
      sendMessage(inputRef.current.value);
      inputRef.current.value = "";
    }
  };

  const handleSendClick = () => {
    scrollToBottom();
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
            onClick={() =>
              setSelectedViewerId(viewer.viewer_id || selectedViewerId)
            }
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
                    message.content === "Paper Accepted"
                      ? "bold"
                      : message.content === "Paper Rejected"
                      ? "bold"
                      : "normal",

                  textAlign: "left",
                  color:
                    message.content === "Paper Accepted"
                      ? "green"
                      : message.content === "Paper Rejected"
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
              marginLeft: 2.5,
              p: "3px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderRadius: "10px",
              width: "100%",
            }}
          >
            <InputBase
              placeholder="Type a message"
              inputProps={{ "aria-label": "Type a message" }}
              inputRef={inputRef}
              sx={{ paddingLeft: "10px" }}
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
