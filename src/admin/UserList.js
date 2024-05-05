import React, { useEffect, useState } from "react";
import { Button, Avatar } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import "../stylesheet/UserList.css"; // Import the CSS file for styling
import ReplyIcon from "@mui/icons-material/Reply";
import { ServerURL, getData } from "../services/ServerServices";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import ReplyUser from "./admin-SubComponents/ReplyUser";
import OpenDocument from "./admin-SubComponents/OpenDocument";
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
// import IosShareIcon from "@mui/icons-material/IosShare";

const UserList = () => {
  const [openDialog, setOpenDialog] = useState(false); // State to control dialog open/close

  const [peopleData, setPeopleData] = useState([]);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false); // State to control reply dialog open/close
  const [openView, setOpenView] = useState(false); // State to control view dialog open/close
  // const [file, setFile] = useState(""); // State to hold the file for view dialog
  // const [userDetails, setUserDetails] = useState("");
  const [personData, setPersonData] = useState("");
  // const [profileColor, setProfileColor] = useState(null);

  const fetchusers = async () => {
    try {
      const result = await getData("form/paper_requests");
      // console.log(result.papers);
      if (result.status) {
        setPeopleData(result.papers);
      }
    } catch (error) {
      colors.error(error);
    }
  };

  // Function to generate a random color from an array of colors

  const colors = [
    deepOrange[500],
    deepPurple[500],
    green[500],
    pink[500],
    red[500],
    purple[500],
    orange[500],
    indigo[500],
    brown[500],
  ];

  console.log("peopledata", peopleData);

  useEffect(() => {
    fetchusers();
    const intervalId = setInterval(() => {
      fetchusers();
    }, 5000);

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleReject = (paperId) => {
    // Filter out the rejected user from the list based on paper_id
    const updatedPeopleData = peopleData.filter(
      (person) => person.paper_id !== paperId
    );
    setPeopleData(updatedPeopleData);
  };

  const handleSendMessage = () => {
    setOpenDialog(true); // Open the dialog when sending message
  };

  const handleReply = (person) => {
    setReplyDialogOpen(true);
    setPersonData(person);
  };

  // const handleView = (person) => {
  //   // setFile(person.file);
  //   setPersonData(person);
  //   // setOpenView(true);
  // };

  const handleCloseView = () => {
    setOpenView(false);
  };

  return (
    <div>
      <h2 className="title">Paper List</h2>
      {peopleData.map((person) => (
        <div key={person.paper_id} className="user-list-container">
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
                  onClick={handleSendMessage}
                  variant="contained"
                >
                  Share
                </Button>

                <Button
                  sx={{ marginRight: "5%" }}
                  variant="text"
                  color="error"
                  onClick={() => handleReject(person.paper_id)}
                >
                  <ClearIcon className="icon" />
                  {/* Reject */}
                </Button>
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

      {/****************** View Dialog Box Start ******************************/}
      {openView && (
        <OpenDocument
          person={personData}
          openView={openView}
          handleCloseView={handleCloseView}
        />
      )}
    </div>
  );
};

export default UserList;
