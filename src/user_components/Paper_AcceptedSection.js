import React, { useCallback, useEffect, useState, useRef } from "react";
import { Grid, Paper } from "@mui/material";
import { ServerURL, getData, postData } from "../services/ServerServices";
import "../stylesheet/PaperTable.css";
import CloudSyncIcon from "@mui/icons-material/CloudSync";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";
import CommentSection from "./CommentSection";
import ChatIcon from "@mui/icons-material/Chat";
import Badge from "@mui/material/Badge";
import { motion } from "framer-motion";
import PaperDialog from "./PaperDialog";
import { io } from "socket.io-client";

let socket;

export default function Paper_AcceptedSection() {
  const [papers, setPapers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [paperId, setPaperId] = useState("");
  const [notifyCount, setNotifyCount] = useState([]);
  const [selectedFile, setSelectedFile] = useState([]);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [personData, setPersonData] = useState([]);
  const fileInputRef = useRef(null);
  const user = localStorage.getItem("user");
  const userObject = JSON.parse(user);
  const viewer = localStorage.getItem("viewer");
  const viewerObject = JSON.parse(viewer);
  let ID =""
  if(userObject){
   ID = userObject.id;
  }
  else if (viewerObject){
  ID = viewerObject.id;
  }
  var itemsPerPage = 10;
  const offset = currentPage * itemsPerPage;
  const currentPapers = papers.slice(offset, offset + itemsPerPage);

  const handlePageChange = (selected) => {
    setCurrentPage(selected.selected); // Set the new page when changed
  };

  // Function to fetch papers
  const fetchPapers = useCallback(async () => {
    try {
      if (viewerObject) {
        const result = await postData(`viewer/fetchPaper_by_Status`, {
          viewer_id: ID,
          paper_status: "accept",
        });
        if (result) {
          console.log("paper details aa gyi bhaiyo accepted viewer", result);
          setPapers(result.papers);
        }
      } else {
        const result = await postData(`form/fetchAccording_To_Paper_Status`, {
          user_id: ID,
          paper_status: "accept",
        });
        if (result) {
          console.log("paper details aa gyi bhaiyo accepted", result);
          setPapers(result.papers);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }, [ID]);

  useEffect(() => {
    fetchPapers();
  }, [fetchPapers]);

  const handleUnCount = async (paperid) => {
    try {
      const body = {
        paperid: paperid,
      };
      var result = await postData("form/reset_count", body);
      console.log("reset", result);
    } catch (error) {}
  };

  const handleComment = async (paperid) => {
    setPaperId(paperid);
    handleUnCount(paperid);
  };

  useEffect(() => {
    socket = io(`${ServerURL}/user-namespace`);

    socket.on("comment_count", (data) => {
      setNotifyCount(data);
      console.log("Received comment count:", data);
      // setCommentCount(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleOpenDocument = (person) => {
    setReplyDialogOpen(true);
    setPersonData(person);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 1.5 } }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
    >
      <Grid
        container
        spacing={0.5}
        style={{ display: "flex", justifyContent: "center" }}
      >
        {/* paper and articles HistoryPage */}
        <Grid item xs={12} md={11} lg={11}>
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
              <h2 className="mainHeading">Accepted Papers</h2>
              {papers?.length > 0 ? (
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
                        <th>Comment</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentPapers.map((paper) => (
                        <tr key={paper.paper_id}>
                          <td className="disabled" data-label="Title">
                            {paper.paper_title}
                          </td>
                          <td className="disabled" data-label="Research Area">
                            {paper.research_area}
                          </td>
                          <td className="disabled" data-label="Submission Date">
                            {new Date(
                              paper.submission_date
                            ).toLocaleDateString()}
                          </td>
                          <td className="disabled" data-label="Status">
                            <span
                              style={{
                                color:
                                  paper.paper_status === "accept"
                                    ? "green"
                                    : paper.paper_status === "reject"
                                    ? "red"
                                    : "black",
                                textTransform: "capitalize",
                                fontWeight: "bold",
                              }}
                            >
                              {paper.paper_status}
                            </span>
                          </td>
                          <td data-label="View Paper">
                            <a
                              href={`${ServerURL}/images/${paper.paper_uploaded}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <center>
                                <CloudDownloadIcon
                                  style={{
                                    color: "#0f0c29",
                                    cursor: "pointer",
                                    fontSize: 25,
                                  }}
                                />
                              </center>
                            </a>
                          </td>
                          <td className="disabled" data-label="Comment">
                            <center>
                              {notifyCount.map((notify) => {
                                if (notify.paper_id === paper.paper_id) {
                                  return (
                                    <Badge
                                      key={notify.paper_id}
                                      badgeContent={notify.count}
                                      color="success"
                                    >
                                      <ChatIcon
                                        style={{
                                          color: "#ff6347",
                                          cursor: "pointer",
                                          fontSize: 25,
                                        }}
                                        onClick={() => {
                                          handleComment(paper.paper_id);
                                        }}
                                      />
                                    </Badge>
                                  );
                                }
                                return null; // Add this line to return null when the condition is not met
                              })}
                              {/* If no match found, display 0 */}
                              {notifyCount.every(
                                (notify) => notify.paper_id !== paper.paper_id
                              ) && (
                                <Badge
                                  key={paper.paper_id}
                                  badgeContent={0}
                                  color="success"
                                >
                                  <ChatIcon
                                    style={{
                                      color: "#ff6347",
                                      cursor: "pointer",
                                      fontSize: 25,
                                    }}
                                    onClick={() => {
                                      handleComment(paper.paper_id);
                                    }}
                                  />
                                </Badge>
                              )}
                            </center>
                          </td>

                          <td className="disabled" data-label="Action">
                            <center>
                              <div
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "0.8rem",
                                  color: "red",
                                  cursor: "pointer",
                                }}
                                onClick={() => handleOpenDocument(paper)}
                              >
                                View all
                              </div>
                            </center>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p
                  style={{
                    textAlign: "center",
                    fontFamily: "sans-serif",
                    paddingTop: "2vh",
                    paddingBottom: "2vh",
                  }}
                >
                  There is no accepeted paper
                </p>
              )}

              {papers?.length > 0 ? (
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
              ) : (
                ""
              )}
            </div>
          </Paper>
        </Grid>
      </Grid>
    </motion.div>
  );
}
