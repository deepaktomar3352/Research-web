import React, { useState, useEffect, useRef, useCallback } from "react";
import { getData, postData } from "../services/ServerServices";
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

const Chat = ({ viewers }) => {
  const paperId = useSelector((state) => state.paper.id); // Accessing the paper ID from the Redux state
  const bottomOfChatRef = useRef(null);
  const chatMessagesRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [viewerData, setViewerData] = useState([]);
  const [selectedViewerId, setSelectedViewerId] = useState(null);

  const addMessage = (newMessage) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };
  // console.log("paperid", paperId);
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
        console.log("shared view data",result.data)
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

  const fetchComments = useCallback(async (viewerId) => {
    try {
      const paper_id = paperId;
      const result = await postData(`viewer/admin_comment`, {
        viewer_id: viewerId,
        paper_id: paper_id,
      });
      setMessages(result.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }, [paperId]);

  useEffect(() => {
    fetchViewerData();
  }, [fetchViewerData]);

  useEffect(() => {
    if (selectedViewerId) {
      const fetchCommentsInterval = setInterval(() => {
        fetchComments(selectedViewerId);
      }, 2000);

      fetchComments(selectedViewerId);

      return () => clearInterval(fetchCommentsInterval);
    }
  }, [selectedViewerId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Scroll to bottom when messages change

  const scrollToBottom = () => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  };

  const sendMessage = async (messageText) => {
    scrollToBottom();
    // console.log("message", selectedViewerId);
    // if (!selectedViewerId && selectedViewerId == null) {
    //   console.error("No viewer selected to send message.");
    //   return;
    // }
    const comment = {
      text: messageText,
    };

    const body = {
      comment: comment.text,
      is_admin_comment: "1",
      viewer_id: selectedViewerId,
      paper_id: paperId,
    };

    try {
      const response = await postData("viewer/send_admin_comment", body);
      if (response.status) {
        await fetchComments(selectedViewerId);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage(e.target.value);
      e.target.value = "";
    }
  };

  const handleSendClick = () => {
    const input = document.querySelector('input[type="text"]');
    sendMessage(input.value);
    input.value = "";
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
        <div className="chat-header">Comment Reply</div>
        <div ref={chatMessagesRef} className="chat-messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${
                message.is_admin_comment === 1 ? "sent" : "received"
              }`}
              ref={index === messages.length - 1 ? bottomOfChatRef : null}
            >
              <div className="message-content">{message.content}</div>
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
            onKeyDown={(e) => handleKeyDown(e)}
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
            />
            <IconButton
              onClick={handleSendClick}
              type="button"
              sx={{ p: "10px" }}
              aria-label="search"
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
