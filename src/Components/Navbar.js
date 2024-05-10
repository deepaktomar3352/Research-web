import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HomePageDrawer from "./HomePageDrawer";
import "../stylesheet/Style.css";
import { Link } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import { ServerURL } from "../services/ServerServices";
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

export default function Navbar(props) {
  const [user, setUser] = useState(null);
  const [viewer, setViewer] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [clickProfile, setClickProfile] = useState(false);
  const [profileColor, setProfileColor] = useState(null);
  const navigate = useNavigate();

  // Check user login status on component mount
  useEffect(() => {
    const userString = localStorage.getItem("user");
    const viewerString = localStorage.getItem("viewer");

    if (userString) {
      setUser(JSON.parse(userString));
      setIsLoggedIn(true);
    }

    if (viewerString) {
      setViewer(JSON.parse(viewerString));
      setIsLoggedIn(true);
    }
  }, []);

  // Set profile color based on user ID
  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };
  
  useEffect(() => {
    if (user && user.id) {
      const userId = user.id;
      const colorIndex = userId % colors.length;
      const userColor = colors[colorIndex];
      setProfileColor(userColor);
    }
  
    if (viewer && viewer.id) {
      const userId = viewer.id;
      const colorIndex = userId % colors.length;
      const userColor = colors[colorIndex];
      setProfileColor(userColor);
    } else {
      // If viewer is not available, generate a random color
      const randomColor = getRandomColor();
      setProfileColor(randomColor);
    }
  }, [user, viewer]);

  // Function to handle user logout
  const handleUserLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null); // Update user state
    window.location.href = "/"; // Navigate to the home page and refresh
  };

  // Function to handle viewer logout
  const handleViewerLogout = () => {
    localStorage.removeItem("viewer");
    setIsLoggedIn(false);
    setViewer(null); // Update viewer state
    navigate("/");
    window.location.href = "/"; // Navigate to the home page and refresh
  };

  return (
    <div>
      <header className="navbar-container">
        <h1>Research Paper</h1>
        <nav>
          <ul>
            {isLoggedIn && (
              <>
                {user && (
                  <>
                    <li>
                      <Link to={"/PaperSubmissionForm"}>Paper Submit</Link>
                    </li>
                    <li>
                      {user.userpic ? (
                        <img
                          onClick={() => setClickProfile(!clickProfile)}
                          src={`${ServerURL}/images/${user.userpic}`}
                          className="user-profile-avatar"
                          alt=""
                        />
                      ) : (
                        <div className="default-profile-avatar">
                          <Avatar
                            onClick={() => setClickProfile(!clickProfile)}
                            sx={{
                              bgcolor: profileColor,
                              width: "1.8vw",
                              height: "1.8vw",
                              padding: 2.2,
                              cursor: "pointer",
                            }}
                          >
                            <div style={{ fontSize: "0.8em" }}>
                              {user.firstname.charAt(0).toUpperCase()}
                              {user.lastname.charAt(0).toUpperCase()}
                            </div>
                          </Avatar>
                        </div>
                      )}
                    </li>
                    {clickProfile && (
                      <div className="user-profile-details-container">
                        <div className="user-profile-details-text">
                          <Link to="/UserProfile">Profile</Link>
                        </div>
                        <div className="user-profile-details-text">
                          <Link
                            className="user-profile-details-text"
                            onClick={handleUserLogout} // Call handleUserLogout on click
                          >
                            Logout
                          </Link>
                        </div>
                      </div>
                    )}
                  </>
                )}
                {viewer && (
                  <>
                    <li>
                      {viewer.userpic ? (
                        <img
                          onClick={() => setClickProfile(!clickProfile)}
                          src={`${ServerURL}/images/${viewer.userpic}`}
                          className="user-profile-avatar"
                          alt=""
                        />
                      ) : (
                        <div className="default-profile-avatar">
                          <Avatar
                            onClick={() => setClickProfile(!clickProfile)}
                            sx={{
                              bgcolor: profileColor,
                              width: "1.8vw",
                              height: "1.8vw",
                              padding: 2.2,
                              cursor: "pointer",
                            }}
                          >
                            <div style={{ fontSize: "0.8em" }}>
                              {viewer.firstname.charAt(0).toUpperCase()}
                              {viewer.lastname.charAt(0).toUpperCase()}
                            </div>
                          </Avatar>
                        </div>
                      )}
                    </li>
                    {clickProfile && (
                      <div className="user-profile-details-container">
                        <div className="user-profile-details-text">
                          <Link to="/UserProfile">Profile</Link>
                        </div>
                        <div className="user-profile-details-text">
                          <Link
                            className="user-profile-details-text"
                            onClick={handleViewerLogout} // Call handleViewerLogout on click
                          >
                            Logout
                          </Link>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
            {!isLoggedIn && (
              <>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/">About Us</Link>
                </li>
                <li>
                  <Link to="/">Contact</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>
    </div>
  );
}
