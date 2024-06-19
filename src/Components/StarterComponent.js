import { React, useEffect, useState } from "react";
import "../stylesheet/Style.css";
import img from "../Images/Research.svg";
import { Link } from "react-router-dom";

export default function StarterComponent() {
  const userLoggedIn = localStorage.getItem("user");

  return (
    <div>
      <section className="featured-papers">
        <div className="paper-list">
          {/* Featured paper components can be dynamically rendered here */}
          <div className="paper-card">
            <div className="paper-cardChild">
            <div className="paper-details">
              <div>
                <span
                  style={{
                    color: "#fff",
                    fontFamily: "sans-serif",
                    fontSize: "2.7rem",
                  }}
                >
                  Empowering Minds Through{" "}
                </span>
                {/* <span
                  style={{
                    color: "#fff",
                    fontFamily:"sans-serif",
                    fontSize:"1.6rem"
                  }}
                >
                  Your 
                </span> */}
                <span
                  style={{
                    color: "#FF6A3D",
                    fontFamily: "sans-serif",
                    fontSize: "2.7rem",
                  }}
                >
                  Research
                </span>
              </div>
              <p>
                Through rigorous investigation and analysis, research lays the
                groundwork for advancements in science, technology, medicine,
                and more.
              </p>

              <Link style={{ textDecoration: "none" }} to={"/SignIn"}>
                <button className="get-started-btn">Get Started</button>
              </Link>
            </div>
            <div className="paper-image">
              <img src={img} alt="Paper" />
            </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
