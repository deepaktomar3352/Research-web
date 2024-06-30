import React, { useCallback, useEffect, useState } from "react";
import { Grid, Paper, Box } from "@mui/material";
import { ServerURL, getData, postData } from "../services/ServerServices";
import "../stylesheet/PaperTable.css";
// import VerifiedIcon from "@mui/icons-material/Verified";
// import ClearIcon from "@mui/icons-material/Clear";
// import IconButton from "@mui/material/IconButton";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";
import CommentSection from "./CommentSection";
import ChatIcon from "@mui/icons-material/Chat";
import Badge from "@mui/material/Badge";
import { useDispatch, useSelector } from "react-redux";
import { setPaperId } from "../Storage/Slices/Paper";
import { motion } from "framer-motion";

// const options = [
//   { name: "Accept", action: "Accept", icon: <VerifiedIcon /> },
//   { name: "Reject", action: "Reject", icon: <ClearIcon /> },
// ];
// const ITEM_HEIGHT = 48;

export default function ViewerHistoryPage() {
  const dispatch = useDispatch();
  const paper_ID = useSelector((state) => state.paper.id); // Accessing the paper ID from the Redux state

  var itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(0);
  const [papers, setPapers] = useState([]);
  const [paperId, setPaper_Id] = useState("");
  const [paper_Title,setPaper_Title] = useState("")
  const [notifyCount, setNotifyCount] = useState([]);
  const viewer = localStorage.getItem("viewer");
  const viewerObject = JSON.parse(viewer);
  const viewer_id = viewerObject.id;

  const offset = currentPage * itemsPerPage;
  const currentPapers = papers.slice(offset, offset + itemsPerPage);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  // const handleClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };
  // const handleClose = () => {
  //   setAnchorEl(null);
  // };
  // const currentArticles = articles.slice(offset, offset + itemsPerPage);

  const handlePageChange = (selected) => {
    setCurrentPage(selected.selected); // Set the new page when changed
  };

  // Function to fetch papers
  const fetchPapers = useCallback(async () => {
    try {
      const result = await postData("viewer/shared_paper_details", {
        viewers_id: viewer_id,
      });
      if (result) {
        setPapers(result.data);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchPapers();
  }, []);

  // const eventHandler = async (data) => {
  //   setAnchorEl(null);
  //   const paperid = data[0];
  //   const eventName = data[1];
  //   console.log("paper id ", paperid);
  //   console.log("event name ", eventName);

  //   if (eventName === "Accept") {
  //     try {
  //       // Show confirmation message
  //       const result = await Swal.fire({
  //         title: "Are you sure?",
  //         text: "Do you want to accept this paper?",
  //         icon: "question",
  //         showCancelButton: true,
  //         confirmButtonText: "Yes, accept it!",
  //         cancelButtonText: "No, cancel!",
  //         reverseButtons: true,
  //       });

  //       if (result.isConfirmed) {
  //         // Viewer confirmed, proceed with acceptance
  //         await postData(`viewer/accept_paper`, {
  //           paper_id: paperid,
  //           status: "accept",
  //         });

  //         Swal.fire("Accepted!", "The paper has been accepted.", "success");
  //       } else if (result.dismiss === Swal.DismissReason.cancel) {
  //         // Viewer cancelled, do nothing
  //         Swal.fire("Cancelled", "The paper was not accepted.", "error");
  //       }
  //       fetchPapers();
  //       setAnchorEl(null);
  //     } catch (error) {
  //       console.error("Error accepting paper:", error);
  //       setAnchorEl(null);
  //     }
  //   } else if (eventName === "Reject") {
  //     try {
  //       // Show confirmation message
  //       const result = await Swal.fire({
  //         title: "Are you sure?",
  //         text: "Do you want to reject this paper?",
  //         icon: "warning",
  //         showCancelButton: true,
  //         confirmButtonText: "Yes, reject it!",
  //         cancelButtonText: "No, cancel!",
  //         reverseButtons: true,
  //       });

  //       if (result.isConfirmed) {
  //         // Viewer confirmed, proceed with rejection
  //         await postData(`viewer/reject_paper`, {
  //           paper_id: paperid,
  //           status: "reject",
  //         });

  //         Swal.fire("Rejected!", "The paper has been rejected.", "success");
  //       } else if (result.dismiss === Swal.DismissReason.cancel) {
  //         // Viewer cancelled, do nothing
  //         Swal.fire("Cancelled", "The paper was not rejected.", "error");
  //       }
  //       fetchPapers();
  //       setAnchorEl(null);
  //     } catch (error) {
  //       console.error("Error rejecting paper:", error);
  //       setAnchorEl(null);
  //     }
  //   } else {
  //     // other event handlers
  //     console.log("event name", eventName);
  //   }
  // };

  const handleComment = async (paperid) => {
    setPaper_Id(paperid[0]);
    setPaper_Title(paperid[1]);
    try {
      const body = {
        paperid: paperid[0],
      };
      var result = await postData("viewer/reset_count", body);
      console.log("reset", result);
    } catch (error) {}
  };

  return (
    <motion.div
    initial={{  opacity: 0 }}
    animate={{ opacity: 1, transition: { duration: 1.5 } }}
    exit={{  opacity: 0, transition: { duration: 0.2 } }}
  >
      <Grid
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        container
        spacing={0.5}
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
                      <th>Status</th>
                      {/* <th>Actions</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {currentPapers.map((paper) => (
                      <tr
                        key={paper.id}
                        onClick={() => dispatch(setPaperId(paper.id))}
                      >
                        <td data-label="Title">
                          {paper.paper_title}
                          <div
                            style={{
                              fontWeight: "bold",
                              textTransform: "capitalize",
                            }}
                          >
                            {paper.paperupload_status}
                          </div>
                        </td>
                        <td data-label="Research Area">{paper.research_area}</td>
                        <td data-label="Abstract">{paper.paper_abstract}</td>
                        <td data-label="Category">{paper.category}</td>
                        <td data-label="Submission Date">
                          {new Date(paper.submission_date).toLocaleDateString()}
                        </td>

                        <td data-label="Comment">
                          <center>
                            {notifyCount.some(
                              (notify) => notify.paper_id === paper.id
                            ) ? (
                              notifyCount.map((notify) => {
                                if (notify.paper_id === paper.id) {
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
                                          handleComment([paper.id,paper.paper_title]);
                                        }}
                                      />
                                    </Badge>
                                  );
                                }
                                return null;
                              })
                            ) : (
                              <Badge
                                key={paper.id}
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
                                    handleComment([paper.id,paper.paper_title]);
                                  }}
                                />
                              </Badge>
                            )}
                          </center>
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
                        <td data-label="Status">{paper.paper_status}</td>
                        {/* <td>
                          <center>
                            <div>
                              <IconButton
                                aria-label="more"
                                id="long-button"
                                aria-controls={open ? "long-menu" : undefined}
                                aria-expanded={open ? "true" : undefined}
                                aria-haspopup="true"
                                onClick={handleClick}
                              >
                                <MoreVertIcon />
                              </IconButton>
                              <Menu
                                id="long-menu"
                                MenuListProps={{
                                  "aria-labelledby": "long-button",
                                }}
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                PaperProps={{
                                  style: {
                                    maxHeight: ITEM_HEIGHT * 4.5,
                                    width: "20ch",
                                  },
                                }}
                              >
                                {options.map((option) => (
                                  <MenuItem
                                    key={option}
                                    selected={option === "Pyxis"}
                                    onClick={() =>
                                      eventHandler([paper_ID, option.name])
                                    }
                                  >
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      {option.icon}
                                      <Box ml={1}>{option.action}</Box>{" "}
                                    </Box>
                                  </MenuItem>
                                ))}
                              </Menu>
                            </div>
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
        <Grid item xs={12} md={11} lg={11}>
          <CommentSection
            viewer_id={viewer_id}
            papers={papers}
            viewerObject={viewerObject}
            paperId={paperId}
            paper_Title={paper_Title}
          />
        </Grid>
      </Grid>
    </motion.div>
  );
}
