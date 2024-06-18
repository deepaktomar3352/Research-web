import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import "../stylesheet/Style.css";

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

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [viewer, setViewer] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileColor, setProfileColor] = useState(null);
  const navigate = useNavigate();

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
    } else if (viewer && viewer.id) {
      const viewerId = viewer.id;
      const colorIndex = viewerId % colors.length;
      const viewerColor = colors[colorIndex];
      setProfileColor(viewerColor);
    } else {
      const randomColor = getRandomColor();
      setProfileColor(randomColor);
    }
  }, [user, viewer]);

  const handleUserLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    navigate("/");
    window.location.reload(); // Reload the page to reset the state
  };

  const handleViewerLogout = () => {
    localStorage.removeItem("viewer");
    setIsLoggedIn(false);
    setViewer(null);
    navigate("/");
    window.location.reload(); // Reload the page to reset the state
  };

  return (
    <div>
      <header className="navbar-container">
        <h2>Research Paper</h2>
        <nav>
          <ul>
            {isLoggedIn && user ? (
              <>
                <li>
                  <Link to="/PaperSubmissionForm">Paper Submit</Link>
                </li>
                <li className="profile-menu">
                  {user.userpic ? (
                    <img
                      src={`${ServerURL}/images/${user.userpic}`}
                      className="user-profile-avatar"
                      alt=""
                    />
                  ) : (
                    <div className="default-profile-avatar">
                      <Avatar
                        sx={{
                          bgcolor: profileColor,
                          width: "1.8vw",
                          height: "1.8vw",
                          padding: 2.2,
                          cursor: "pointer",
                        }}
                      >
                        <div style={{ fontSize: "0.8rem" }}>
                          {user.firstname.charAt(0).toUpperCase()}
                          {user.lastname.charAt(0).toUpperCase()}
                        </div>
                      </Avatar>
                    </div>
                  )}
                  <ul className="dropdown-menu">
                    <li>
                      <Link to="/UserProfile">Profile</Link>
                    </li>
                    <li>
                      <Link onClick={handleUserLogout}>Logout</Link>
                    </li>
                  </ul>
                </li>
              </>
            ) : isLoggedIn && viewer ? (
              <>
                <li className="profile-menu">
                  {viewer.userpic ? (
                    <img
                      src={`${ServerURL}/images/${viewer.userpic}`}
                      className="user-profile-avatar"
                      alt=""
                    />
                  ) : (
                    <div className="default-profile-avatar">
                      <Avatar
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
                  <ul className="dropdown-menu">
                    <li>
                      <Link to="/UserProfile">Profile</Link>
                    </li>
                    <li>
                      <Link onClick={handleViewerLogout}>Logout</Link>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
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
