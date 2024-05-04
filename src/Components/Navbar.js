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
  // Retrieve the item from localStorage
  const userString = localStorage.getItem("user");
  const user = JSON.parse(userString);
  const navigate = useNavigate();
  const [MobileMenu, setMobileMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [clickProfile, setClickProfile] = useState(false);
  const [profileColor, setProfileColor] = useState(null);



  // Check user login status on component mount
  useEffect(() => {
    const userLoggedIn = localStorage.getItem("user");
    if (userLoggedIn) {
      setIsLoggedIn(true);
    }
    
    
  
    if (user && user.id) {
      const userId = user.id;
      const colorIndex = userId % colors.length;
      const userColor = colors[colorIndex];
      setProfileColor(userColor);
    }
   
  }, [user]);

  // Function to handle user logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/")
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setMobileMenu(window.innerWidth < 600);
    };

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  return (
    <div>
      <header className="navbar-container">
        <h1>Research Paper</h1>
        {MobileMenu ? (
          <>
            <HomePageDrawer color={"#ec1ce8"} />
          </>
        ) : (
          <>
            <nav>
              <ul>
                {userString ? (
                  <></>
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
                {isLoggedIn && (
                  <>
                    <li>
                      <Link onClick={() => props.setRender("home")}>Home</Link>
                    </li>
                    <li>
                      <Link onClick={() => props.setRender("submit-paper")}>
                        Submit Paper
                      </Link>
                    </li>
                    {/* <li>
                      <Link onClick={() => props.setRender("article-paper")}>
                        Submit Articles
                      </Link>
                    </li> */}

                    {user.userpic ? (
                      <li>
                        <img
                          onClick={() => setClickProfile(!clickProfile)}
                          src={`${ServerURL}/images/${user.userpic}`}
                          className="user-profile-avatar"
                          alt=""
                        />
                      </li>
                    ) : (
                      <li>
                        {/* If user profile is not available, create a default profile with the first letter of their name */}
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
                      </li>
                    )}

                    {clickProfile ? (
                      <>
                        <div className="user-profile-details-container">
                          <div className="user-profile-details-text">
                            <Link to="/UserProfile">Profile</Link>
                          </div>

                          <div className="user-profile-details-text">
                            <Link
                              className="user-profile-details-text"
                              onClick={handleLogout}
                            >
                              Logout
                            </Link>
                          </div>
                        </div>
                      </>
                    ) : null}

                    {/* <li>
                      <Link to="/">User Profile</Link>
                    </li> */}
                    {/* <li>
                      <button
                        style={{
                          border: "none",
                          backgroundColor: "transparent",
                          color: "#fff", 
                          cursor: "pointer", 
                          fontSize:"1vw",
                          fontWeight:500
                        }}
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li> */}
                  </>
                )}
              </ul>
            </nav>
          </>
        )}
      </header>
    </div>
  );
}
