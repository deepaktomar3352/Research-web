import { React, useState } from "react";
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
import NotificationsIcon from "@mui/icons-material/Notifications";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import DnsIcon from '@mui/icons-material/Dns';
import ViewListIcon from '@mui/icons-material/ViewList';
import ListItemText from "@mui/material/ListItemText";
import MainView from "./MainView";
import PeopleIcon from "@mui/icons-material/People";
import Viewer_Registration from "./admin-SubComponents/Viewer_Registration";
import Viewers_list from "./admin-SubComponents/Viewers_list";
import Users_list from "./admin-SubComponents/showUsers_List";

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

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();



export default function Dashboard() {
  
  const [open, setOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("dashboard"); // Track active item

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  const renderComponent = () => {
    switch (
      activeItem // Render component based on active item
    ) {
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

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex"}}>
        {/* <CssBaseline /> */}
        <AppBar sx={{background:"#0f0c29"}} position="absolute" open={open}>
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
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
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
  );
}
