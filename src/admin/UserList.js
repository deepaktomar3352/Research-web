import React, { useCallback, useEffect, useState } from "react";
import { Button, Avatar, Box,IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import "../stylesheet/UserList.css"; // Import the CSS file for styling
import ReplyIcon from "@mui/icons-material/Reply";
import { ServerURL, getData, postData } from "../services/ServerServices";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import Swal from "sweetalert2";
import DeleteIcon from "@mui/icons-material/Delete";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VerifiedIcon from "@mui/icons-material/Verified";
import { useDispatch, useSelector } from "react-redux";
import { setPaperId } from "../Storage/Slices/Paper";

import { pink } from "@mui/material/colors";
import ReplyUser from "./admin-SubComponents/ReplyUser";
import UserSelection from "./admin-SubComponents/UserSelection";

const options = [
  { name: "Delete", action: "Delete", icon: <DeleteIcon /> },
  { name: "Accept", action: "Accept", icon: <VerifiedIcon /> },
  { name: "Reject", action: "Reject", icon: <ClearIcon /> },
];

const ITEM_HEIGHT = 48;

const UserList = () => {
  const PAPER_ID = useSelector((state) => state.paper.id);
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false); // State to control dialog open/close

  const [peopleData, setPeopleData] = useState([]);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false); // State to control reply dialog open/close
  const [viewerDialogOpen, setViewerDialogOpen] = useState(false); // State to control reply dialog open/close
  const [personData, setPersonData] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const fetchUsers = useCallback(async () => {
    try {
      const result = await getData("form/paper_requests");
      if (result.status) {
        setPeopleData(result.papers);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    const intervalId = setInterval(() => {
      fetchUsers();
    }, 5000);

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, [fetchUsers]);

  const eventHandler = async (data) => {
    setAnchorEl(null);
    const paperid = PAPER_ID;
    const eventName = data;

    if (eventName === "Accept") {
      try {
        // Show confirmation message
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "Do you want to accept this paper?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes, accept it!",
          cancelButtonText: "No, cancel!",
          reverseButtons: true,
        });

        if (result.isConfirmed) {
          // Viewer confirmed, proceed with acceptance
          await postData(`admin/updateAdminPaperStatus`, {
            paper_id: paperid,
            status: "accept",
          });

          Swal.fire("Accepted!", "The paper has been accepted.", "success");
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // Viewer cancelled, do nothing
          Swal.fire("Cancelled", "The paper was not accepted.", "error");
        }
        fetchUsers();
        setAnchorEl(null);
      } catch (error) {
        console.error("Error accepting paper:", error);
        setAnchorEl(null);
      }
    } else if (eventName === "Reject") {
      try {
        // Show confirmation message
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "Do you want to reject this paper?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, reject it!",
          cancelButtonText: "No, cancel!",
          reverseButtons: true,
        });

        if (result.isConfirmed) {
          // Viewer confirmed, proceed with rejection
          await postData(`admin/updateAdminPaperStatus`, {
            paper_id: paperid,
            status: "reject",
          });

          Swal.fire("Rejected!", "The paper has been rejected.", "success");
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // Viewer cancelled, do nothing
          Swal.fire("Cancelled", "The paper was not rejected.", "error");
        }
        fetchUsers();
        setAnchorEl(null);
      } catch (error) {
        console.error("Error rejecting paper:", error);
        setAnchorEl(null);
      }
    } else if (eventName === "Delete") {
      try {
        // Show confirmation message
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "Do you want to delete this paper?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "No, cancel!",
          reverseButtons: true,
        });

        if (result.isConfirmed) {
          // Viewer confirmed, proceed with deletion
          await postData(`admin/deleteAdmin_paper`, {
            paper_id: paperid,
          });

          Swal.fire("Deleted!", "The paper has been deleted.", "success");
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // Viewer cancelled, do nothing
          Swal.fire("Cancelled", "The paper was not deleted.", "error");
        }
        fetchUsers();
        setAnchorEl(null);
      } catch (error) {
        console.error("Error deleting paper:", error);
        setAnchorEl(null);
      }
    } else {
      // other event handlers
      console.log("event name", eventName);
    }
  };

  const handleViewerSelection = (person) => {
    setOpenDialog(true); // Open the dialog when sending message
    setViewerDialogOpen(true); // Open the dialog when receiving
    setPersonData(person);
  };

  const handleReply = (person) => {
    setReplyDialogOpen(true);
    setPersonData(person);
  };


  return (
    <div>
      <h2 className="title">Paper List</h2>
      {peopleData.length > 0 ? (
        peopleData.map((person) => (
          <div
            onClick={() => {
              dispatch(setPaperId(person.paper_id));
            }}
            style={{cursor:"pointer"}}
            key={person.paper_id}
            className="user-list-container"
          >
            <ul>
              <li className="user-item">
                <div className="user-info">
                  <div className="user-pic-name-align">
                    {person.userpic ? (
                      <img
                        src={`${ServerURL}/images/${person.userpic}`}
                        alt=""
                        className="user-image"
                      />
                    ) : (
                      <Avatar
                        className="user-image"
                        sx={{
                          bgcolor: pink[500],
                          width: "1.8vw",
                          height: "1.8vw",
                          padding: 2.2,
                          cursor: "pointer",
                        }}
                      >
                        <div style={{ fontSize: "0.8em" }}>
                          {person.firstname.charAt(0).toUpperCase()}
                          {person.lastname.charAt(0).toUpperCase()}
                        </div>
                      </Avatar>
                    )}

                    <div className="user-details">
                      <span className="user-name">
                        {person.firstname + " " + person.lastname}
                      </span>
                    </div>
                  </div>
                  <span
                    style={{
                      marginLeft: "50px",
                      fontSize: 12,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {person.paper_title}
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: "bold",
                        textTransform: "capitalize",
                      }}
                    >
                      {person.paperupload_status}
                    </span>
                  </span>
                </div>
                <div className="button-container">
                  <Button
                    sx={{ marginRight: "2%" }}
                    variant="text"
                    onClick={() => handleReply(person)}
                  >
                    <ReplyIcon sx={{ color: "#0f0c29" }} />
                  </Button>

                  <Button
                    sx={{ marginRight: "2%" }}
                    variant="text"
                  >
                    <a
                      rel="noreferrer"
                      href={`${ServerURL}/images/${person.paper_uploaded}`}
                      target="_blank"
                    >
                      <CloudDownloadIcon sx={{ color: "#ff6347" }} />
                    </a>
                  </Button>

                  <Button
                    sx={{ marginRight: "2%", background: "#0f0c29" }}
                    onClick={() => handleViewerSelection(person)}
                    variant="contained"
                  >
                    Share
                  </Button>

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
                          key={option.name}
                          onClick={() => eventHandler(option.name)}
                        >
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            {option.icon}
                            <Box ml={1}>{option.action}</Box>
                          </Box>
                        </MenuItem>
                      ))}
                    </Menu>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        ))
      ) :  (
        <p style={{ textAlign: "center", fontFamily: "sans-serif",paddingTop:'2vh',paddingBottom:"2vh" }}>
          There is no current paper
        </p>
      )}

      {replyDialogOpen && (
        <ReplyUser
          person={personData}
          replyDialogOpen={replyDialogOpen}
          handleReplyDialogClose={() => setReplyDialogOpen(false)}
        />
      )}

      {viewerDialogOpen && (
        <UserSelection
          personData={personData}
          viewerDialogOpen={viewerDialogOpen}
          handleViewerDialogClose={() => setViewerDialogOpen(false)}
        />
      )}
    </div>
  );
};

export default UserList;
