import React, { useCallback, useEffect, useState } from "react";
import { Paper, TextField, Button, Avatar } from "@mui/material";
import { ServerURL, getData, postData } from "../services/ServerServices";
import "../stylesheet/PaperTable.css";
import SendIcon from "@mui/icons-material/Send";
import VisibilityIcon from "@mui/icons-material/Visibility";

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

export default function CommentSection(props) {
  const [showComments, setShowComments] = useState([]);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const fetchComments = useCallback(async () => {
    try {
      const result = await postData(`viewer/viewer_comment`, {
        viewer_id: props.viewer_id,
        paper_id: props.paperId,
      });
      setShowComments(result.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }, [props.viewer_id, props.paperId]);

  useEffect(() => {
    fetchComments();
    const intervalId = setInterval(fetchComments, 3000);

    return () => {
      clearInterval(intervalId);
    };
  }, [props.paperId, fetchComments]);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleCommentSend = async () => {
    if (comment.trim()) {
      const newComment = { text: comment, date: new Date() };
      setComments([...comments, newComment]);
      setComment(""); // Clear the input field
      await handleCommentSubmit(newComment); // Send the latest comment
      fetchComments();
    }
  };

  const handleCommentSubmit = async (comment) => {
    try {
      const body = {
        comment: comment.text,
        is_admin_comment: "0",
        viewer_id: props.viewer_id,
        paper_id: props.paperId,
      };
      const response = await postData("viewer/send_comment", body);
      console.log("Response:", response.data);
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

        <h3>Comments:</h3>
        <div
          style={{
            overflowY: "scroll",
          }}
        >
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
                        <Avatar
                          src={`${ServerURL}/images/${props.viewerObject.userpic}`}
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
                        : props.viewerObject.firstname +
                          " " +
                          props.viewerObject.lastname}
                    </h3>

                    <div>
                      <p style={{ fontSize: 12 }}>{formatDate(c.created_at)}</p>
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
                {c.paper_id &&
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
                  )}
              </div>
            ))}
        </div>
      </Paper>
    </div>
  );
}
