import React, { useState, useEffect } from "react";
import "../stylesheet/Style.css";
import Navbar from "../Components/Navbar";
import StarterPage from "../Components/StarterComponent";
import AboutPage from "../Components/About";
import ContactPage from "../Components/Contact";
import Footer from "../Components/Footer";
import PaperSubmissionForm from "../forms/PaperSubmissionForm";
import ArticlePage from "../forms/ArticlePage";
import HistoryPage from "../user_components/HistoryPage";
import ViewerHistoryPage from "../viewerComponents/ViewerHistoryPage";
import { useRef } from "react";
import { motion, useScroll } from "framer-motion";

const Home = () => {
  const userLoggedIn = localStorage.getItem("user");
  const [user, setUser] = useState(null);
  const [viewer, setViewer] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [renderType, setRenderType] = useState("home");

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ container: ref });

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

  const renderedComponent = () => {
    if (user) {
      switch (renderType) {
        case "home":
          return <HistoryPage />;
        case "submit-paper":
          return <PaperSubmissionForm />;
        case "article-paper":
          return <ArticlePage />;
        default:
          return null;
      }
    } else if (viewer) {
      switch (renderType) {
        case "home":
          return <ViewerHistoryPage />;
        default:
          return null;
      }
    }
  };

  return (
    <div className="home-page">
      {/* <svg id="progress" width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="30" pathLength="1" className="bg" />
        <motion.circle
          cx="50"
          cy="50"
          r="30"
          pathLength="1"
          className="indicator"
          style={{ pathLength: scrollXProgress }}
        />
      </svg> */}
      <div className="childDiv" ref={ref}>
        {/* ----------------------------------NavBar Section------------------------------ */}
        <div>
          <Navbar setRender={setRenderType} />
        </div>
        <div className="content">
          {isLoggedIn ? (
            <>{renderedComponent()}</>
          ) : (
            <>
              {/* ----------------------------------Starter Section------------------------------ */}
              <div id="home">
                <StarterPage />
              </div>
              {/* ----------------------------------About Section------------------------------ */}
              <div id="aboutPage">
                <AboutPage  />
              </div>
              {/* ------------------------------------Contact section---------------------------- */}
              <div id="contact">
                <ContactPage />
              </div>
            </>
          )}
        </div>
        {/* ------------------------------------Footer section---------------------------- */}
        <div className="footer">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Home;
