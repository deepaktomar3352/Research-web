import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import Popover from "@mui/material/Popover";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import { ListItemButton } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { ServerURL, getData, postData } from "../../services/ServerServices";
import { formatDistanceToNow } from "date-fns";
import { useSelector, useDispatch } from "react-redux";
import { setViewerId } from "../../Storage/Slices/viewer";
import { setComments, markCommentAsRead } from "../../Storage/Slices/Comment";
import ReplyUser from "./ReplyUser";
import io from "socket.io-client";

let socket;

export default function CommentCount() {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false); // State to control reply dialog open/close
  const [personData, setPersonData] = useState("");
  const [comments, setComments] = useState({
    userComments: [],
    viewerComments: [],
  });
  const [CommentCount, setCommentCount] = useState([]);
  const allComments = [...comments.userComments, ...comments.viewerComments];

  useEffect(() => {
    socket = io(`${ServerURL}/admin-namespace`);


    socket.on("counter", (count) => {
      // console.log("counter", count);
      const user = count.userCommentCount;
      const viewer = count.viewerCommentCount;
      setCommentCount(user + viewer);
    });

   

    socket.on("new_comments", (count) => {
      // console.log("comments", count);
      setComments({
        userComments: count.userComments,
        viewerComments: count.viewerComments,
      });
    });
  }, []);

  const openPopover = Boolean(anchorEl);
  const popoverId = openPopover ? "notifications-popover" : undefined;

  const handleNotificationsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };



  const handleCommentClick = async (person) => {
    if (person.commentType === "user") {
      setReplyDialogOpen(true);
      console.log("clicked",person)
      setPersonData(person);
      socket.emit("uncount_admin_notification",person)
      // const body = person;
      // var result = await postData(`admin/uncount_admin_notification`, body);
    }
    if (person.commentType === "viewer") {
      dispatch(setViewerId(person))
      socket.emit("uncount_admin_notification",person)
      // const body = person;
      // var result = await postData(`admin/uncount_admin_notification`, body);
    }
  };

  // Sort comments by created_at in descending order
  const sortedComments = allComments.sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  // Determine whether to show the plus sign
  const displayCount = CommentCount > 25 ? "25+" : CommentCount;

  // console.log("shorted",sortedComments);

  return (
    <div>
      <IconButton color="inherit" onClick={handleNotificationsClick}>
        <Badge badgeContent={displayCount} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Popover
        id={popoverId}
        open={openPopover}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box
          sx={{
            p: 1,
            maxWidth: 400,
            maxHeight: 600, // Adjust height as needed
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            msOverflowStyle: "none", // IE and Edge
            scrollbarWidth: "none", // Firefox
          }}
        >
          <List>
            {sortedComments.map((message, index) => (
              <ListItemButton
                key={index}
                onClick={() => handleCommentClick(message)}
                sx={{
                  bgcolor:
                    message.status === "0" ? "inherit" : "rgba(0, 0, 255, 0.1)", // Light blue background for new comments
                }}
              >
                <Badge
                  variant="dot"
                  color="primary"
                  invisible={message.status === "0"}
                ></Badge>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar
                      alt={message.viewerName || message.firstname}
                      src={`${ServerURL}/images/${message.userpic}`}
                      sx={{ width: 40, height: 40, objectFit: "cover" }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <React.Fragment>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography component="span" variant="body1">
                            {message.viewerName ||
                              `${message.firstname} ${message.lastname}` ||
                              message.lastName}
                          </Typography>
                          <Typography
                            component="span"
                            variant="caption"
                            sx={{ fontSize: 10, marginLeft: 1 }}
                          >
                            {`${formatDistanceToNow(
                              new Date(message.created_at)
                            )} ago`}
                          </Typography>
                        </Box>
                        <span  style={{ fontSize: 13,color:"#ff6347" }} >
                            {`${message.commentType}`}
                          </span>
                      </React.Fragment>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography
                          sx={{ display: "inline" }}
                          component="span"
                          variant="caption"
                          color="text.primary"
                        >
                          {message.content}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Popover>
      {replyDialogOpen && (
        <ReplyUser
          person={personData}
          replyDialogOpen={replyDialogOpen}
          handleReplyDialogClose={() => setReplyDialogOpen(false)}
        />
      )}
    </div>
  );
}
