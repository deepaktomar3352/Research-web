import { React, useEffect, useState } from "react";
import "../stylesheet/Style.css";
import img from "../Images/Research.png";
import { Link } from "react-router-dom";

export default function StarterComponent() {
  const userLoggedIn = localStorage.getItem("user");


  return (
    <div>
      <section className="featured-papers">
        <div className="paper-list">
          {/* Featured paper components can be dynamically rendered here */}
          <div className="paper-card">
            <div className="paper-image">
              <img src={img} alt="Paper" />
            </div>
            <div className="paper-details">
              <div>
                <span style={{ color: "#ec1ce8" }}>About</span>
                <span
                  style={{
                    color: "#fff",
                  }}
                >
                  Research
                </span>
                <span
                  style={{
                    color: "#FF6A3D",
                  }}
                >
                  Papers
                </span>
              </div>
              <p>
                Research papers are scholarly articles that present original
                research, analysis, and findings within a specific field of
                study. They are essential components of academic and scientific
                discourse, serving to advance knowledge and contribute to
                ongoing conversations within various disciplines.
              </p>
              
                  <Link style={{ textDecoration: "none" }} to={"SignIn"}>
                    <button className="get-started-btn">Get Started</button>
                  </Link>                
                
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
