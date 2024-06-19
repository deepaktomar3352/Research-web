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
import { ServerURL, getData } from "../../services/ServerServices";
import { formatDistanceToNow } from "date-fns";
import { useSelector, useDispatch } from "react-redux";
import { setComments, markCommentAsRead } from "../../Storage/Slices/Comment";
import ReplyUser from "./ReplyUser";

export default function CommentCount() {
  const dispatch = useDispatch();
  const { userComments, viewerComments, userCommentCount, viewerCommentCount } =
    useSelector((state) => state.comments);
  const [anchorEl, setAnchorEl] = useState(null);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false); // State to control reply dialog open/close
  const [personData, setPersonData] = useState("");

  const fetchCommentCounts = async () => {
    const result = await getData("admin/admin_messages_count");
    dispatch(
      setComments({
        userComments: result.userComments || [],
        viewerComments: result.viewerComments || [],
        userCommentCount: result.userCommentCount,
        viewerCommentCount: result.viewerCommentCount,
      })
    );
  };

  useEffect(() => {
    fetchCommentCounts();
    const intervalId = setInterval(fetchCommentCounts, 5000); // Fetch comments every 5 seconds
    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, [dispatch]);

  const openPopover = Boolean(anchorEl);
  const popoverId = openPopover ? "notifications-popover" : undefined;


  const handleNotificationsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleCommentClick = (id, type, person) => {
    dispatch(markCommentAsRead({ id, type }));
    setReplyDialogOpen(true);
    if (type === "user") {
      setPersonData(person);
    }
  };

  console.log("person", personData);

  // Sort comments by created_at in descending order
  const sortedComments = userComments
    .concat(viewerComments)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <div>
      <IconButton color="inherit" onClick={handleNotificationsClick}>
        <Badge
          badgeContent={userCommentCount + viewerCommentCount}
          color="secondary"
        >
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
        sx={{}}
      >
        <Box
          sx={{
            p: 1,
            maxWidth: 360,
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
                onClick={() =>
                  handleCommentClick(message.id, message.commentType, message)
                }
                sx={{
                  bgcolor: (message.commentType === "user"
                    ? userComments
                    : viewerComments
                  ).find((comment) => comment.id === message.id && comment.read)
                    ? "inherit"
                    : "rgba(0, 0, 255, 0.1)", // Light blue background for new comments
                }}
              >
                <Badge
                  variant="dot"
                  color="primary"
                  invisible={(message.commentType === "user"
                    ? userComments
                    : viewerComments
                  ).find(
                    (comment) => comment.id === message.id && comment.read
                  )}
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
