import React, { useCallback, useEffect, useState } from "react";
import { Paper, TextField, Button, Avatar } from "@mui/material";
import { ServerURL, getData, postData } from "../services/ServerServices";
import "../stylesheet/PaperTable.css";
import SendIcon from "@mui/icons-material/Send";
import VisibilityIcon from "@mui/icons-material/Visibility";
import io from "socket.io-client";
import admin from "../Images/admin.png"
import { formatDistanceToNow } from "date-fns";


let socket;



export default function CommentSection(props) {
  const [showComments, setShowComments] = useState([]);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  

  useEffect(() => {
    // Initialize socket connection
    socket = io(`${ServerURL}/user-namespace`);
    socket.emit('fetch_comments', { user_id: props.user_id, paper_id: props.paperId,user:"user" });


    // Event listener for new comments from the server
    socket.on("comments", (msg) => {
      // console.log("newComment", msg);
      const updatedComments = [...showComments, ...msg];
      setShowComments(updatedComments);
    });


    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [props.paperId, props.user_id]);


  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleCommentSend = async () => {
    if (comment.trim()) {
      const newComment = { text: comment, date: new Date() };
      setComments([...comments, newComment]);
      setComment(""); // Clear the input field
      await handleCommentSubmit(newComment); // Send the latest comment
      props.UnCount(props.paperId);
      // fetchComments();
    }
  };

  const handleCommentSubmit = async (comment) => {
    try {
      const body = {
        comment: comment.text,
        is_admin_comment: "0",
        user_id: props.user_id,
        paper_id: props.paperId,
        user:"user"
      };
      socket.emit('new_comment',body)
      // const response = await postData("form/send_comment", body);
      // console.log("Response:", response.data);
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  return (
    <div>
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          maxHeight: "74vh",
          m: "3%",
        }}
      >
        {props.paperId ? (
          <>
            <div>
              <h2>Send a comment to Admin</h2>
              <TextField
                autoFocus
                autoComplete="off"
                margin="dense"
                label="Type Your Message..."
                type="text"
                sx={{ width: "100%" }}
                value={comment}
                autoCapitalize="words"
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
                  // color="primary"
                  sx={{ backgroundColor: "#0f0c29" }}
                  // endIcon={}
                >
                  {/* comment */}
                  <SendIcon />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <></>
        )}

        <div
          style={{
            overflowY: "scroll",
            "&::WebkitScrollbar": {
              display: "none", // Hides scrollbar in WebKit browsers
            },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
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
                            borderRadius: 50,
                            marginRight: 10,
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                            backgroundSize:"cover"
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <Avatar
                          src={`${ServerURL}/images/${props.userObject.userpic}`}
                          alt={"User icon"}
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 50,
                            marginRight: 10,
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                            backgroundSize:"cover"
                          }}
                        />
                      </>
                    )}

                    <h3 style={{ marginRight: "auto" }}>
                      {c.is_admin_comment === 1
                        ? "Admin"
                        : props.userObject.firstname +
                          " " +
                          props.userObject.lastname}
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
                        fontSize: 13,
                      }}
                    >
                      {c.content}
                    </p>
                  </div>
                </ul>
                {/* {c.paper_id &&
                  props.papers.some(
                    (paper) => paper.paper_id === c.paper_id
                  ) && (
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
                          href={`${ServerURL}/images/${
                            props.papers.find(
                              (paper) => paper.paper_id === c.paper_id
                            ).paper_uploaded
                          }`}
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
                  )} */}
              </div>
            ))}
        </div>
      </Paper>
    </div>
  );
}
