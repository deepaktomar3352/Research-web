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

export default function HistoryPage() {
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
  const user_id = userObject.id;

  var itemsPerPage = 10;
  const offset = currentPage * itemsPerPage;
  const currentPapers = papers.slice(offset, offset + itemsPerPage);

  const handlePageChange = (selected) => {
    setCurrentPage(selected.selected); // Set the new page when changed
  };

  // Function to fetch papers
  const fetchPapers = useCallback(async () => {
    try {
      const result = await getData(`form/user_paper?user_id=${user_id}`);
      if (result) {
        console.log("paper details aa gyi bhaiyo", result);
        setPapers(result.papers);
      }
    } catch (error) {
      console.error(error);
    }
  }, [user_id]);

  useEffect(() => {
    fetchPapers();
  }, [fetchPapers]);

  const handleIconClick = async () => {
    try {
      // Show confirmation message
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to re-upload this paper?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, re-upload it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        fileInputRef.current.click();
      } else {
        // User cancelled, do nothing
        Swal.fire("Cancelled", "Your paper has not been re-uploaded.", "error");
      }
      fetchPapers();
    } catch (error) {
      console.error("Error re-uploading paper:", error);
    }
  };

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
    const fetchNewAdminCommentsCount = async () => {
      try {
        const results = await getData(`form/new_count`);
        setNotifyCount(results.counts);
      } catch (error) {
        console.error("Error fetching new admin comments count:", error);
      }
    };

    fetchNewAdminCommentsCount();
    const interval = setInterval(fetchNewAdminCommentsCount, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleFileChange = async (event, paperID) => {
    const file = event.target.files[0];
    console.log("paperID", paperID);
    console.log("file", file);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("paper_id", paperID);

    try {
      const response = await postData("form/reupload_paper", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("response", response);

      Swal.fire({
        icon: "success",
        title: "Upload Successful",
        text: "Your file has been uploaded successfully!",
      });
    } catch (error) {
      console.error("There was an error uploading the file!", error);

      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "There was an error uploading your file. Please try again.",
      });
    }
  };

  const handleOpenDocument = (person) => {
    setReplyDialogOpen(true);
    setPersonData(person);
  };

  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: "100%", transition: { duration: 0.3 } }}
      exit={{ x: window.innerWidth, transition: { duration: 0.2 } }}
    >
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
              <h2 className="mainHeading">Your Papers</h2>
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
                      <tr key={paper.id}>
                        <td data-label="Title">{paper.paper_title}</td>
                        <td data-label="Research Area">
                          {paper.research_area}
                        </td>
                        <td data-label="Submission Date">
                          {new Date(paper.submission_date).toLocaleDateString()}
                        </td>
                        <td data-label="Status">
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
                        <td data-label="Comment">
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
                        {/* <td data-label="Action">
                          <center>
                            <div
                              style={{
                                fontWeight: "bold",
                                fontSize: "0.8rem",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <input
                                type="file"
                                onChange={(event) =>
                                  handleFileChange(event, paper.paper_id)
                                }
                                ref={fileInputRef}
                                style={{ display: "none" }}
                              />
                              <CloudSyncIcon
                                style={{
                                  // color: "red",
                                  cursor: "pointer",
                                  fontSize: 25,
                                }}
                                onClick={handleIconClick}
                              />
                              {paper.paperupload_status}
                            </div>
                          </center>
                        </td> */}
                        <td data-label="Action">
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
        </Grid>

        {/* comment box start from here... */}
        <Grid item xs={12} md={4} lg={4}>
          {" "}
          <CommentSection
            user_id={user_id}
            papers={papers}
            userObject={userObject}
            paperId={paperId}
            UnCount={handleUnCount}
          />
        </Grid>
      </Grid>
      <PaperDialog
       person={personData}
       replyDialogOpen={replyDialogOpen}
       handleReplyDialogClose={() => setReplyDialogOpen(false)}
      />
    </motion.div>
  );
}
