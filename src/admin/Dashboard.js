import React, { useEffect, useState } from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import DnsIcon from "@mui/icons-material/Dns";
import ViewListIcon from "@mui/icons-material/ViewList";
import ListItemText from "@mui/material/ListItemText";
import MainView from "./MainView";
import PeopleIcon from "@mui/icons-material/People";
import Viewer_Registration from "./admin-SubComponents/Viewer_Registration";
import Viewers_list from "./admin-SubComponents/Viewers_list";
import CommentCount from "./admin-SubComponents/CommentCount";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Users_list from "./admin-SubComponents/showUsers_List";
import { motion } from "framer-motion";
import { ServerURL } from "../services/ServerServices";
import { useNavigate } from "react-router-dom";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth = 220;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const defaultTheme = createTheme();

export default function Dashboard() {
  const [open, setOpen] = useState(true);
  const adminString = localStorage.getItem("admin");
  const adminData = JSON.parse(adminString);
  const [activeItem, setActiveItem] = useState("dashboard");
  const navigate = useNavigate();
  // Track active item

  const [anchorEl, setAnchorEl] = React.useState(null);
  const Open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const toggleDrawer = () => {
    setOpen(!Open);
  };

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  const renderComponent = () => {
    switch (activeItem) {
      case "dashboard":
        return <MainView />;
      case "viewer_registration":
        return <Viewer_Registration />;
      case "Viewers_list":
        return <Viewers_list />;
      case "Users_list":
        return <Users_list />;
      default:
        return null;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("viewer");
    localStorage.removeItem("admin");
    navigate("/");
    window.location.reload(); // Adjust the path to your login or home page
  };

  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: "100%", transition: { duration: 0.3 } }}
      exit={{ x: window.innerWidth, transition: { duration: 0.2 } }}
    >
      <ThemeProvider theme={defaultTheme}>
        <Box sx={{ display: "flex" }}>
          {/* <CssBaseline /> */}
          <AppBar
            sx={{ background: "#0f0c29" }}
            position="absolute"
            open={open}
          >
            <Toolbar
              sx={{
                pr: "24px", // keep right padding when drawer closed
              }}
            >
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
                sx={{
                  marginRight: "36px",
                  ...(open && { display: "none" }),
                }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ flexGrow: 1 }}
              >
                Dashboard
              </Typography>

              {/* <CommentCount/> */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={open ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                  >
                    <Avatar
                      src={`${ServerURL}/images/${adminData[0].admin_profile}`}
                      sx={{
                        width: 32,
                        height: 32,
                        textTransform: "capitalize",
                      }}
                    >
                      {adminData[0].admin_name.charAt(0)}
                    </Avatar>
                  </IconButton>
                </Tooltip>
              </Box>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={Open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&::before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <Link sx={{textDecoration:"none",color:"black"}} href="/AdminProfile">
                  <MenuItem>Profile</MenuItem>
                </Link>
                <Divider />
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Toolbar>
          </AppBar>

          <Drawer variant="permanent" open={open}>
            <Toolbar
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                px: [1],
              }}
            >
              <IconButton onClick={toggleDrawer}>
                <ChevronLeftIcon />
              </IconButton>
            </Toolbar>
            <Divider />
            <List component="nav">
              <ListItemButton
                onClick={() => handleItemClick("dashboard")} // Set active item on click
                selected={activeItem === "dashboard"}
              >
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>

              <ListItemButton
                onClick={() => handleItemClick("viewer_registration")} // Set active item on click
                selected={activeItem === "viewer_registration"} // Check if it's active
              >
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Viewer" />
              </ListItemButton>
              <ListItemButton
                onClick={() => handleItemClick("Viewers_list")} // Set active item on click
                selected={activeItem === "Viewers_list"} // Check if it's active
              >
                <ListItemIcon>
                  <DnsIcon />
                </ListItemIcon>
                <ListItemText primary="Viewers List" />
              </ListItemButton>
              <ListItemButton
                onClick={() => handleItemClick("Users_list")} // Set active item on click
                selected={activeItem === "Users_list"} // Check if it's active
              >
                <ListItemIcon>
                  <ViewListIcon />
                </ListItemIcon>
                <ListItemText primary="Users List" />
              </ListItemButton>
              <Divider sx={{ my: 1 }} />
            </List>
          </Drawer>

          <CommentCount />

          <Box
            component="main"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: "100vh",
              overflow: "auto",
            }}
          >
            <Toolbar />
            {renderComponent()}
          </Box>
        </Box>
      </ThemeProvider>
    </motion.div>
  );
}
