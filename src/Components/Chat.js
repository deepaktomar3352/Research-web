import React, { useState, useEffect, useRef } from 'react';
import '../stylesheet/Chat.css'; // Import CSS file for styling
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'; // Import Material-UI Icon

const Chat = () => {
  // Ref for the bottom of the chat
  const bottomOfChatRef = useRef(null);

  // Define state for messages
  const [messages, setMessages] = useState(() => {
    // Check if messages exist in localStorage, otherwise initialize with default messages
    const storedMessages = localStorage.getItem('chatMessages');
    return storedMessages ? JSON.parse(storedMessages) : [];
  });

  // const [scrolledToTop, setScrolledToTop] = useState(false);

  // Define function to add a new message
  const addMessage = (newMessage) => {
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

  // Update localStorage whenever messages change
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    scrollToBottom(); // Scroll to bottom when messages change
  }, [messages]);

  // Scroll to the bottom of the chat
  const scrollToBottom = () => {
    bottomOfChatRef.current.scrollIntoView({ behavior: "smooth" });
  };

  // Function to handle sending a message
  const sendMessage = (messageText) => {
    const newMessage = {
      sender: "You", // Assuming the sender is the current user
      recipient: "Bob", // Assuming the recipient is always Bob
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
      message: messageText
    };
    addMessage(newMessage);
  };

  // Function to simulate Bob sending a message
  const sendBobMessage = () => {
    const newMessage = {
      sender: "Bob",
      recipient: "You",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
      message: "Hello Deepak! This is Bob."
    };
    addMessage(newMessage);
  };

  // Simulate Bob sending a message on component mount
  useEffect(() => {
    sendBobMessage();
  }, []);

  return (
    <div className="chat-container">
      <div className="chat-header">WhatsApp Messenger</div>
      <div className="chat-messages">
        {/* Render each message */}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender === 'You' ? 'sent' : 'received'}`}
            ref={index === messages.length - 1 ? bottomOfChatRef : null} // Set ref for the last message
          >
            <div className="message-content">{message.message}</div>
            <div className="message-timestamp">{message.timestamp}</div>
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
      {/* <div className="scroll-to-bottom" onClick={scrollToBottom}>
        <KeyboardArrowDownIcon />
      </div> */}
    </div>
  );
};

export default Chat;
