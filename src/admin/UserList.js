import React, { useCallback, useEffect, useState } from "react";
import { Button, Avatar, Box } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import "../stylesheet/UserList.css"; // Import the CSS file for styling
import ReplyIcon from "@mui/icons-material/Reply";
import { ServerURL, getData, postData } from "../services/ServerServices";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import ChatIcon from "@mui/icons-material/Chat";
import ReplyUser from "./admin-SubComponents/ReplyUser";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Swal from "sweetalert2";
import DeleteIcon from "@mui/icons-material/Delete";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VerifiedIcon from "@mui/icons-material/Verified";
import { useDispatch } from "react-redux";
import { setPaperId } from "../Storage/Slices/Paper";

import {
  deepOrange,
  deepPurple,
  green,
  pink,
  purple,
  red,
  orange,
  indigo,
  brown,
} from "@mui/material/colors";
import UserSelection from "./admin-SubComponents/UserSelection";
// import IosShareIcon from "@mui/icons-material/IosShare";
const options = [
  { name: "Delete", action: "Delete", icon: <DeleteIcon /> },
  { name: "Accept", action: "Accept", icon: <VerifiedIcon /> },
  { name: "Reject", action: "Reject", icon: <ClearIcon /> },
];

const ITEM_HEIGHT = 48;

const UserList = () => {
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false); // State to control dialog open/close

  const [peopleData, setPeopleData] = useState([]);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false); // State to control reply dialog open/close
  const [viewerDialogOpen, setViewerDialogOpen] = useState(false); // State to control reply dialog open/close
  // const [openView, setOpenView] = useState(false); // State to control view dialog open/close
  const [personData, setPersonData] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const fetchusers = useCallback(async () => {
    try {
      const result = await getData("form/paper_requests");
      // console.log(result.papers);
      if (result.status) {
        setPeopleData(result.papers);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  // Function to generate a random color from an array of colors

  // const colors = [
  //   deepOrange[500],
  //   deepPurple[500],
  //   green[500],
  //   pink[500],
  //   red[500],
  //   purple[500],
  //   orange[500],
  //   indigo[500],
  //   brown[500],
  // ];

  // console.log("peopledata", peopleData);

  useEffect(() => {
    fetchusers();
    const intervalId = setInterval(() => {
      fetchusers();
    }, 5000);

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const eventHandler = async (data) => {
    setAnchorEl(null);
    const paperId = data[0];
    const eventName = data[1];
    if (eventName === "Delete") {
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
          const response = await postData("form/deleteAdmin_paper", {
            paper_id: paperId,
          });
          console.log("Paper deleted successfully:", response.data);

          Swal.fire("Deleted!", "Your paper has been deleted.", "success");

          fetchusers()
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire("Cancelled", "Your paper is safe :)", "error");
        }
      } catch (error) {
        console.error("There was an error deleting the paper!", error);
        console.log("Error deleting paper", { variant: "error" });
      }
    } else {
      console.log("event name ", eventName);
    }
  };

  // const handleReject = (paperId) => {
  //   // Filter out the rejected user from the list based on paper_id
  //   const updatedPeopleData = peopleData.filter(
  //     (person) => person.paper_id !== paperId
  //   );
  //   setPeopleData(updatedPeopleData);
  // };

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
      {peopleData.map((person) => (
        <div
          onClick={() => dispatch(setPaperId(person.paper_id))}
          style={{
            cursor: "pointer",
            overflowX: "auto",
            "&::WebkitScrollbar": { display: "none" },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
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
                      // onClick={() => setClickProfile(!clickProfile)}
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
                <span style={{ marginLeft: "3rem", fontSize: 12 }}>
                  {person.paper_title}
                </span>
              </div>
              <div className="button-container">
                <Button
                  sx={{ marginRight: "2%" }}
                  variant="text"
                  onClick={() => handleReply(person)}
                >
                  <ReplyIcon />
                </Button>

                <Button
                  sx={{ marginRight: "2%" }}
                  variant="text"
                  // onClick={() => handleView(person)}
                >
                  <a
                    rel="noreferrer"
                    href={`${ServerURL}/images/${person.paper_uploaded}`}
                    target="_blank"
                  >
                    <CloudDownloadIcon />
                  </a>
                  {/* View */}
                </Button>

                <Button
                  sx={{ marginRight: "2%" }}
                  onClick={() => handleViewerSelection(person)}
                  variant="contained"
                >
                  Share
                </Button>

                {/* <Button
                  sx={{ marginRight: "5%" }}
                  variant="text"
                  color="error"
                  onClick={() => handleReject(person.paper_id)}
                >
                  <ClearIcon className="icon" />
                </Button> */}
                {/* <Stack>
                  <IconButton onClick={()=>handlePaperDelete()} sx={{ colors: "red" }} aria-label="delete">
                    <DeleteIcon
                      style={{
                        color: "red",
                        cursor: "pointer",
                      }}
                    />
                  </IconButton>
                </Stack> */}
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
                        selected={option.name === "Pyxis"}
                        onClick={() =>
                          eventHandler([person.paper_id, option.name])
                        }
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
      ))}

      {/*******************  comment section start here ****************** */}

      {replyDialogOpen && (
        <ReplyUser
          person={personData}
          replyDialogOpen={replyDialogOpen}
          handleReplyDialogClose={() => setReplyDialogOpen(false)}
        />
      )}

      {/*******************  select viewer section start here ****************** */}
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
