import React, { useCallback, useEffect, useState } from "react";
import { Grid, Paper } from "@mui/material";
import { ServerURL, getData, postData } from "../services/ServerServices";
import "../stylesheet/PaperTable.css";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";
import CommentSection from "./CommentSection";
import ChatIcon from "@mui/icons-material/Chat";
import Badge from "@mui/material/Badge";

export default function ViewerHistoryPage() {
  const [papers, setPapers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [paperId, setPaperId] = useState("");
  const [notifyCount, setNotifyCount] = useState([]);
  const viewer = localStorage.getItem("viewer");
  const viewerObject = JSON.parse(viewer);
  const viewer_id = viewerObject.id;

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
      const result = await getData(`viewer/viewer_paper_data?viewer_id=${viewer_id}`);
      if (result) {
        setPapers(result);
        console.log(result);
      }
    } catch (error) {
      console.error(error);
    }
  }, [viewer_id]);

  useEffect(() => {
    fetchPapers();
  }, [fetchPapers]);

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
        // viewer confirmed, proceed with deletion
        await getData(`form/delete_paper?id=${paperid}`);

        Swal.fire("Deleted!", "Your paper has been deleted.", "success");
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // viewer cancelled, do nothing
        Swal.fire("Cancelled", "Your paper is safe :)", "error");
      }
      fetchPapers();
    } catch (error) {
      console.error("Error deleting paper:", error);
    }
  };

  const handleComment = async (paperid) => {
    setPaperId(paperid);
    try {
      const body = {
        paperid: paperid,
      };
      var result = await postData("form/reset_count", body);
      console.log("reset", result);
    } catch (error) {}
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
              <h1>Papers</h1>
              <div style={{ overflowX: "auto" }}>
                {" "}
                {/* Wrapper for horizontal scrolling */}
                <table className="styled-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Research Area</th>
                      <th>Paper Abstract</th>
                      <th>Category</th>
                      <th>Submission Date</th>
                      <th>Comment</th>
                      <th>View Paper</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPapers.map((paper) => (
                      <tr key={paper.id}>
                        <td>{paper.paper_title}</td>
                        <td>{paper.research_area}</td>
                        <td>{paper.paper_abstract}</td>
                        <td>{paper.category}</td>
                        <td>
                          {new Date(paper.submission_date).toLocaleDateString()}
                        </td>

                        <td>
                          <center>
                            {notifyCount.map((notify) => {
                              if (notify.paper_id === paper.paper_id) {
                                return (
                                  <Badge
                                    key={notify.paper_id}
                                    badgeContent={notify.count}
                                    color="primary"
                                  >
                                    <ChatIcon
                                      style={{
                                        color: "#ed15d8",
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
                                color="primary"
                              >
                                <ChatIcon
                                  style={{
                                    color: "#ed15d8",
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

                        {/* <td>
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
                        </td> */}
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
            viewer_id={viewer_id}
            papers={papers}
            viewerObject={viewerObject}
            paperId={paperId}
          />
        </Grid>
      </Grid>
    </div>
  );
}
