import React, { useCallback, useEffect, useState } from "react";
import { Grid, Paper, TextField, Button } from "@mui/material";
import { ServerURL, getData, postData } from "../services/ServerServices";
import "../stylesheet/PaperTable.css";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import ReactPaginate from "react-paginate";
import SendIcon from "@mui/icons-material/Send";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Swal from "sweetalert2";

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

export default function HistoryPage() {
  // const [articles, setArticles] = useState([]);
  const [papers, setPapers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState([]);
  const user = localStorage.getItem("user");
  const userObject = JSON.parse(user);
  const user_id = userObject.id;

  const fetchComments = useCallback(
    async (paper_id) => {
      try {
        const result = await getData(
          `form/user_comment?user_id=${user_id}&paper_id=${paper_id}`
        );
        setShowComments(result.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    },
    [user_id]
  );

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
        user_id: user_id,
      };
      const response = await postData("form/send_comment", body);
      // console.log("Response:", response.data);
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  var itemsPerPage = 10;
  const offset = currentPage * itemsPerPage;
  const currentPapers = papers.slice(offset, offset + itemsPerPage);
  // const currentArticles = articles.slice(offset, offset + itemsPerPage);

  const handlePageChange = (selected) => {
    setCurrentPage(selected.selected); // Set the new page when changed
  };

  // Function to fetch papers
  const fetchPapers = useCallback(async () => {
    try {
      const result = await getData(`form/user_paper?user_id=${user_id}`);
      if (result) {
        setPapers(result.papers);
      }
    } catch (error) {
      console.error(error);
    }
  }, [user_id]);

  console.log(papers);
  // console.log(articles);

  // const fetchArticles = async () => {
  //   try {
  //     const result = await getData(`form/user_articles?articleId=${user_id}`);
  //     if (result) {
  //       setArticles(result.article);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    fetchPapers();
    const intervalId = setInterval(fetchCommentsForAllPapers, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [fetchPapers]);

  const fetchCommentsForAllPapers = useCallback(() => {
    papers.forEach((paper) => {
      fetchComments(paper.paper_id);
    });
  }, [papers, fetchComments]);

  const fetchCommentsForAllPapersPeriodically = useCallback(() => {
    fetchCommentsForAllPapers();
  }, [fetchCommentsForAllPapers]);

  useEffect(() => {
    fetchCommentsForAllPapersPeriodically();

    const intervalId = setInterval(fetchCommentsForAllPapersPeriodically, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [fetchCommentsForAllPapersPeriodically]);

  // function to delete a paper
  const DeletePaper = async (paperid) => {
    try {
      // Show confirmation message
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You will not be able to recover this paper!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        // User confirmed, proceed with deletion
        await getData(`form/delete_paper?id=${paperid}`);

        Swal.fire("Deleted!", "Your paper has been deleted.", "success");
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // User cancelled, do nothing
        Swal.fire("Cancelled", "Your paper is safe :)", "error");
      }
      fetchPapers();
    } catch (error) {
      console.error("Error deleting paper:", error);
    }
  };

  // function to delete a article
  // const DeleteArticle = async (paperid) => {
  //   var response = await getData(`form/delete_article?id=${paperid}`);
  //   fetchPapers();
  //   // console.log(response);
  // };

  return (
    <div>
      <Grid container spacing={0.5}>
        {/* paper and articles HistoryPage */}
        <Grid item xs={12} md={8} lg={8}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: "auto",
              m: "2%",
              overflow: "auto", // Allow horizontal overflow if content is too wide
            }}
          >
            <div>
              <h1>Your Papers</h1>
              <div style={{ overflowX: "auto" }}>
                {" "}
                {/* Wrapper for horizontal scrolling */}
                <table className="styled-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Research Area</th>
                      <th>Submission Date</th>
                      <th>Status</th>
                      <th>View Paper</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPapers.map((paper) => (
                      <tr key={paper.paper_id}>
                        <td>{paper.paper_title}</td>
                        <td>{paper.research_area}</td>
                        <td>
                          {new Date(paper.submission_date).toLocaleDateString()}
                        </td>

                        <td>{paper.paper_status}</td>
                        <td>
                          <a
                            href={`${ServerURL}/images/${paper.paper_uploaded}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <center>
                              <CloudDownloadIcon
                                style={{
                                  // color: "red",
                                  cursor: "pointer",
                                  fontSize: 25,
                                }}
                              />
                            </center>
                          </a>
                        </td>
                        <td>
                          <center>
                            <DeleteIcon
                              style={{
                                color: "red",
                                cursor: "pointer",
                                fontSize: 25,
                              }}
                              onClick={() => {
                                DeletePaper(paper.paper_id);
                              }}
                            />
                          </center>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Add pagination */}
              <ReactPaginate
                previousLabel={<span>&#11104; Previous</span>}
                nextLabel={<span>Next &#11106;</span>}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={Math.ceil(papers.length / itemsPerPage)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageChange}
                containerClassName={"pagination"}
                subContainerClassName={"pages pagination"}
                activeClassName={"active"}
              />
            </div>
          </Paper>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: "auto",
              m: "2%",
              overflow: "auto", // Allow horizontal overflow if content is too wide
            }}
          >
            {/* <div>
              <h1>Your Articles</h1>
              <div style={{ overflowX: "auto" }}>
                {" "}
               
                <table className="styled-table">
                  <thead>
                    <tr>
                      <th>Manuscript Title</th>
                      <th>Reviewers Area</th>
                      <th>Subjects</th>
                      <th>Submission Date</th>
                      <th>Status</th>
                      <th>View Paper</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentArticles.map((paper) => (
                      <tr key={paper.id}>
                        <td>{paper.manuscript_title}</td>
                        <td>{paper.reviewers_area}</td>
                        <td>{paper.subjects}</td>
                        <td>
                          {new Date(paper.submission_date).toLocaleDateString()}
                        </td>
                        <td>{paper.article_status}</td>
                        <td>
                          <a
                            href={`${ServerURL}/images/${paper.uploaded_article}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <center>
                              <CloudDownloadIcon
                                style={{
                                  cursor: "pointer",
                                  fontSize: 25,
                                }}
                              />
                            </center>
                          </a>
                        </td>
                        <td>
                          <center>
                            <DeleteIcon
                              style={{
                                color: "red",
                                cursor: "pointer",
                                fontSize: 25,
                              }}
                              onClick={() => {
                                DeleteArticle(paper.id);
                              }}
                            />
                          </center>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <ReactPaginate
                previousLabel={<span>&#11104; Previous</span>}
                nextLabel={<span>Next &#11106;</span>}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={Math.ceil(articles.length / itemsPerPage)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageChange}
                containerClassName={"pagination"}
                subContainerClassName={"pages pagination"}
                activeClassName={"active"}
              />
            </div> */}
          </Paper>
        </Grid>

        {/* comment box start from here... */}
        <Grid item xs={12} md={4} lg={4}>
          {" "}
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              maxHeight: "74vh",
              m: "3%",
            }}
          >
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
                              src={`${ServerURL}/images/${userObject.userpic}`}
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
                            : userObject.firstname + " " + userObject.lastname}
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
                            fontSize: 13,
                          }}
                        >
                          {c.content}
                        </p>
                      </div>
                    </ul>
                    {c.paper_id &&
                      papers.some((paper) => paper.paper_id === c.paper_id) && (
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
                                papers.find(
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
        </Grid>
      </Grid>
    </div>
  );
}
