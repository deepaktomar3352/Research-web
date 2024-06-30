import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  IconButton,
  Avatar,
} from "@mui/material";
import "../../stylesheet/UserList.css"; // Import the CSS file for styling
import CloseIcon from "@mui/icons-material/Close";
import { ServerURL, getData, postData } from "../../services/ServerServices";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { formatDistanceToNow } from "date-fns";
import io from "socket.io-client";
import admin from "../../Images/admin.png";

let socket;

export default function ReplyUser(props) {
  const [comment, setComment] = useState(""); // Current comment text
  const [comments, setComments] = useState([]); // All comments
  const [showComments, setShowComments] = useState([]);
  const [user_id, setUserId] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);


  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  useEffect(() => {
    // Initialize socket connection
    socket = io(`${ServerURL}/admin-namespace`);
    socket.emit("fetch_comments", {
      user_id: props.person.user_id || props.person.id,
      paper_id: props.person.paper_id,
      user: "admin",
    });

    const user_id = props.person.user_id || props.person.id;
    setUserId(user_id);

    
    // Event listener for new comments from the server
    socket.on("comments", (msg) => {
      // console.log("newComment", msg);
      const updatedComments = [ ...showComments, ...msg ];
      setShowComments(updatedComments);
    });
    
   

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [props.person.user_id || props.person.id, props.person.paper_id,ServerURL]);

  const handleCommentSubmit = async (comment, user_id) => {
    // console.log(comment.text);
    const body = {
      comment: comment.text,
      user_id: user_id,
      paper_id: props.person.paper_id,
    };

    try {
      socket.emit("new_comment", body);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCommentSend = async () => {
    if (comment.trim()) {
      const newComment = { text: comment, date: new Date() };
      setComments([...comments, newComment]);
      setComment(""); // Clear the input field
      await handleCommentSubmit(newComment, user_id || props.person.id); // Pass user_id to handleCommentSubmit
      socket.emit("fetch_comments", {
        user_id: props.person.user_id || props.person.id,
        paper_id: props.person.paper_id,
      });
    }
  };



  // console.log("props", props.person);
  return (
    <div>
      {/****************** Reply Dialog Box Start ******************************/}
      <Dialog
        maxWidth="md"
        PaperProps={{
          style: {
            width: "60%", // Adjust as needed
            position: "relative",
          },
        }}
        open={props.replyDialogOpen}
        onClose={props.handleReplyDialogClose}
      >
        <DialogTitle>
          Reply to {props.person.firstname + " " + props.person.lastname}
        </DialogTitle>
        <IconButton
          onClick={props.handleReplyDialogClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <div>
            <TextField
              autoFocus
              margin="dense"
              label="Your Comment"
              type="text"
              sx={{ width: "100%" }}
              value={comment}
              autoCapitalize="true"
              onChange={handleCommentChange}
            />
            <div
              style={{
                justifyContent: "end",
                display: "flex",
                padding: "5px 0px",
              }}
            >
              <Button
                variant="contained"
                onClick={handleCommentSend}
                color="primary"
              >
                Send
              </Button>
            </div>
          </div>

          <div
            style={{
              overflowY: "scroll",
              WebkitScrollbar: {
                display: "none", // Hides scrollbar in WebKit browsers
              },
              msOverflowStyle: "none",
              scrollbarWidth: "none",
              height: "50vh",
            }}
          >
            <h3>Comments:</h3>
            {showComments
              .slice()
              .reverse()
              .map((c, index) => (
                <div key={index}>
                  <ul>
                    <li
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexDirection: "row",
                        padding: 10,
                        marginTop: 20,
                      }}
                    >
                      {c.is_admin_comment === 1 ? (
                        <>
                          <Avatar
                            src={admin}
                            alt={"Admin icon"}
                            style={{
                              width: 30,
                              height: 30,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                              marginRight: 10,
                            }}
                          />
                        </>
                      ) : (
                        <>
                          <Avatar
                            src={`${ServerURL}/images/${props.person.userpic}`}
                            alt={"User icon"}
                            style={{
                              width: 30,
                              height: 30,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                              marginRight: 10,
                            }}
                          />
                        </>
                      )}

                      <h3 style={{ marginRight: "auto" }}>
                        {c.is_admin_comment === 1
                          ? "Admin"
                          : props.person.firstname +
                            " " +
                            props.person.lastname}
                      </h3>

                      <div>
                        <p style={{ fontSize: 12 }}>
                        {formatDistanceToNow(new Date(c.created_at), { addSuffix: true, baseDate: currentTime })}
                        </p>
                      </div>
                    </li>
                    <div style={{ marginLeft: 50, marginTop: -10 }}>
                      <p
                        style={{
                          textTransform: "capitalize",
                          fontSize: "clamp(12px, 1.8vw, 13px)",
                        }}
                      >
                        {c.content}
                      </p>
                    </div>
                  </ul>
                  {/* {c.is_admin_comment === 1 ? (
                    <>
                      <div
                        style={{
                          marginTop: 10,
                          display: "flex",
                          justifyContent: "end",
                        }}
                      >
                        <div>
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={`${ServerURL}/images/${props.person.paper_uploaded}`}
                          >
                            <VisibilityIcon
                              style={{
                                cursor: "pointer",
                                color: "#FF4F00",
                                fontSize: "clamp(12px, 3.3vw, 32px)",
                              }}
                            />
                          </a>
                        </div>
                      </div>
                    </>
                  ) : (
                    <></>
                  )} */}
                </div>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
