import { React, useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  FormControlLabel,
  Checkbox,
  DialogActions,
  Button,
  Avatar,
  IconButton,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ServerURL, getData, postData } from "../../services/ServerServices";
import CloseIcon from "@mui/icons-material/Close";

export default function UserSelection(props) {
  const matches = useMediaQuery("(min-width:600px)");
  const [selectedUsers, setSelectedUsers] = useState([]); // State to store selected users
  const [viewerData, setViewerData] = useState([]); // State to store

  const fetchViewerData = useCallback(async () => {
    try {
      var result = await getData("viewer/viewer_info");
      setViewerData(result.viewer);
      // console.log(result);
    } catch (error) {}
  }, []);

  useEffect(() => {
    fetchViewerData();
  }, []);

  const handleCheckboxChange = (event, userId) => {
    if (event.target.checked) {
      setSelectedUsers([...selectedUsers, userId]);
      // console.log("Selected users", selectedUsers);
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    }
  };

  const handleSendData = async () => {
    try {
      const body = {
        viewer_id: selectedUsers,
        paper_id: props.personData.paper_id,
      };
      var result = await postData("viewer/send_paper", body);
      console.log("data send :-", result);
      props.handleViewerDialogClose(false);
    } catch (error) {
      console.log(error);
    }
  };

  //   const handleAccept = (person) => {
  //     props.setAcceptedUsers([...acceptedUsers, person.user_id]); // Store only the ID
  //   };

  return (
    <div>
      {/****************** Dialog Box Start ******************************/}
      <Dialog
        maxWidth="md"
        PaperProps={{
          style: {
            width: matches ? "50%" : "30%",
            maxHeight: "60vh",
            position: "relative",
          },
        }}
        open={props.viewerDialogOpen}
        onClose={props.handleViewerDialogClose}
      >
        <DialogTitle>Select Users</DialogTitle>
        <IconButton
          onClick={props.handleViewerDialogClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>

        <div
          style={{
            overflowY: "scroll",
            WebkitScrollbar: {
              display: "none", // Hides scrollbar in WebKit browsers
            },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          {viewerData.map((person) => (
            <DialogContent key={person.id}>
              <FormControlLabel
                sx={{ display: "flex", flexDirection: "row" }}
                control={
                  <Checkbox
                    checked={selectedUsers.includes(person.id)}
                    onChange={(event) => handleCheckboxChange(event, person.id)}
                  />
                }
                label={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      src={`${ServerURL}/images/${person.userpic}`}
                      sx={{ marginRight: "8px" }}
                      alt={`${person.firstname} ${person.lastname}`}
                    />
                    <span>
                      {person.firstname} {person.lastname}
                    </span>
                  </div>
                }
              />
            </DialogContent>
          ))}
        </div>

        <DialogActions>
          <Button onClick={props.handleViewerDialogClose}>Cancel</Button>
          <Button autoFocus onClick={handleSendData} color="primary">
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
