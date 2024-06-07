import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getData, postData } from '../services/ServerServices';
import '../stylesheet/Chat.css'; // Import CSS file for styling

const Chat = ({ viewers }) => {
  const bottomOfChatRef = useRef(null);
  const chatMessagesRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [viewerData, setViewerData] = useState([]);
  const [selectedViewerId, setSelectedViewerId] = useState(null);

  const addMessage = (newMessage) => {
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

  const fetchViewerData = useCallback(async () => {
    try {
      const result = await getData("viewer/viewer_info");
      setViewerData(result.viewer);
    } catch (error) {
      console.error("Error fetching viewer data:", error);
    }
  }, []);

  const fetchComments = useCallback(async (viewerId) => {
    try {
      const result = await getData(`viewer/admin_comment?viewer_id=${viewerId}`);
      setMessages(result.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }, []);

  useEffect(() => {
    fetchViewerData();
  }, [fetchViewerData]);

  useEffect(() => {
    if (selectedViewerId) {
      const fetchCommentsInterval = setInterval(() => {
        fetchComments(selectedViewerId);
      }, 2000); // Fetch comments every 2 seconds
  
      // Fetch comments immediately when the viewer is selected
      fetchComments(selectedViewerId);
  
      return () => clearInterval(fetchCommentsInterval); // Clean up the interval on component unmount
    }
  }, [selectedViewerId]); // Removed `fetchComments` from the dependency array to prevent unnecessary interval creation

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
    if (!selectedViewerId) {
      console.error("No viewer selected to send message.");
      return;
    }

    const comment = {
      text: messageText
    };

    const body = {
      comment: comment.text,
      is_admin_comment: "1",
      viewer_id: selectedViewerId
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

  return (
    <div className="chat-container">
      <div className="viewer-list">
        {viewerData.map(viewer => (
          <div key={viewer.id} onClick={() => setSelectedViewerId(viewer.id)} className={`viewer ${selectedViewerId === viewer.id ? 'active' : ''}`}>
            <div>{viewer.firstname} {viewer.lastname}</div>
          </div>
        ))}
      </div>
      <div className="chat">
        <div className="chat-header">Comment Reply</div>
        <div ref={chatMessagesRef} className="chat-messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.is_admin_comment === 1 ? 'sent' : 'received'}`}
              ref={index === messages.length - 1 ? bottomOfChatRef : null}
            >
              <div className="message-content">{message.content}</div>
              <div className="message-timestamp">{new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            placeholder="Type a message..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                sendMessage(e.target.value);
                e.target.value = '';
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
