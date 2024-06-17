import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import ListItemText from "@mui/material/ListItemText";
import Popover from "@mui/material/Popover";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { getData } from "../../services/ServerServices";
import { formatDistanceToNow } from "date-fns";

export default function CommentCount() {
  const [messages, setMessages] = useState({
    userComments: [],
    viewerComments: [],
  });
  const [userCommentCount, setUserCommentCount] = useState(0);
  const [viewerCommentCount, setViewerCommentCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);

  const fetchCommentCounts = async () => {
    var result = await getData("admin/admin_messages_count");
    console.log(result);
    setUserCommentCount(result.userCommentCount);
    setViewerCommentCount(result.viewerCommentCount);
    setMessages({
      userComments: result.userComments || [],
      viewerComments: result.viewerComments || [],
    });
  };

  useEffect(() => {
    fetchCommentCounts();
    const intervalId = setInterval(fetchCommentCounts, 5000); // Fetch comments every 5 seconds
    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, []);

  console.log("messages", messages);

  const openPopover = Boolean(anchorEl);
  const popoverId = openPopover ? "notifications-popover" : undefined;

  const handleNotificationsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  // Sort comments by created_at in descending order
  const sortedComments = messages.userComments
    .concat(messages.viewerComments)
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
      >
        <Box sx={{ p: 2, maxWidth: 360 }}>
          {sortedComments.map((message, index) => (
            <ListItem key={index} alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt={message.viewerName || message.userName} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <React.Fragment>
                   <Typography sx={{ display: "flex",justifyContent:"space-between",alignItems:"center" }}>
                   <Typography>
                      {message.viewerName ||
                        message.userName + "" + message.lastName ||
                        message.lastName}
                    </Typography>
                    <Typography sx={{marginRight:"auto",fontSize:12}}>
                    {'('+message.commentType+')'}
                   </Typography>
                   <Typography sx={{fontSize:10}} >
                   {` ${formatDistanceToNow(
                      new Date(message.created_at)
                    )} ago`}
                   </Typography>
                   </Typography>
                   
                  </React.Fragment>
                }
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {message.content}
                    </Typography>
                   
                  </React.Fragment>
                }
              />
            </ListItem>
          ))}
        </Box>
      </Popover>
    </div>
  );
}
