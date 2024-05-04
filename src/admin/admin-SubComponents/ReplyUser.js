import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  IconButton,
} from "@mui/material";
import "../../stylesheet/UserList.css"; // Import the CSS file for styling
import CloseIcon from "@mui/icons-material/Close";
import { ServerURL, getData, postData } from "../../services/ServerServices";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function ReplyUser(props) {
  const [comment, setComment] = useState(""); // Current comment text
  const [comments, setComments] = useState([]); // All comments
  const [showComments, setShowComments] = useState([]);
  const [user_id, setUserId] = useState("");

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const fetchComments = useCallback(async () => {
    if (props.person && props.person.user_id) {
      try {
        const user_id = props.person.user_id;
        setUserId(user_id);
        const result = await getData(`form/admin_comment?user_id=${user_id}`);
        setShowComments(result.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    }
  }, [props.person]);

  const handleCommentSubmit = async (comment, user_id) => {
    console.log(comment.text);
    const body = {
      comment: comment.text,
      is_admin_comment: "1",
      user_id: user_id,
      paper_id: props.person.paper_id
    };

    try {
      const response = await postData("form/send_admin_comment", body);
      if (response.status) {
        await fetchComments({ user_id });
        // console.log("Response:", response.status);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCommentSend = async () => {
    if (comment.trim()) {
      const newComment = { text: comment, date: new Date() };
      setComments([...comments, newComment]);
      setComment(""); // Clear the input field
      await handleCommentSubmit(newComment, user_id); // Pass user_id to handleCommentSubmit
    }
  };

  useEffect(() => {
    fetchComments(); // Fetch
    const intervalId = setInterval(fetchComments, 5000); // Fetch comments every 5 seconds
    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, [fetchComments]); // Add fetchComments to the dependency array

  const formatDate = (dateString) => {
    const date = new Date(dateString);
  
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
  
    let hours = date.getHours();
    const isPM = hours >= 12; // Determine if it's PM
    const displayHours = hours % 12 || 12; // Convert to 12-hour format
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = isPM ? "PM" : "AM"; // Determine AM or PM
  
    return `${day}/${month}/${year} ${displayHours}:${minutes} ${ampm}`;
  };
  
console.log("props", props.person);
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
              sx={{ width: "100%", }}
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
                          <img
                            src={
                              "https://pluspng.com/img-png/png-user-icon-icons-logos-emojis-users-2400.png"
                            }
                            alt={"Admin icon"}
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: 50,
                              marginRight: 10,
                            }}
                          />
                        </>
                      ) : (
                        <>
                          <img
                            src={`${ServerURL}/images/${props.person.userpic}`}
                            alt={"User icon"}
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: 50,
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
                          {formatDate(c.created_at)}
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
                  {c.is_admin_comment === 1 ? (
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
                  ) : (<></>)}
                </div>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
