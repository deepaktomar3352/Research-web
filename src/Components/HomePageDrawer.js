import { React, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import ArticleIcon from '@mui/icons-material/Article';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { Link } from "react-router-dom";


export default function HomePageDrawer(props) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
      {[
        // { text: "Home", link: "/" },
        // { text: "About Us", link: "/about" },
        // { text: "Contact", link: "/contact" },
        { text: "Submit Paper", link: "/PaperSubmissionForm" },
        { text: "Submit Articles", link: "/ArticlePage" }
      ].map(
          (item, index) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton component={Link} to={item.link}>
                <ListItemIcon>
                  {index % 2 === 0 ? <HistoryEduIcon /> : <ArticleIcon />}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          )
        )}
      </List>
      <Divider />
      <List>
      {[
        { text: "User Profile", link: "/profile" },
        { text: "Log Out", link: "/logout" }
      ].map((item, index) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <PersonIcon /> : <LogoutIcon />}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <Button onClick={toggleDrawer(true)}>
        <MenuIcon style={{ color: props.color }} />
      </Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
