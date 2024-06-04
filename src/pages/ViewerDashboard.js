import React, { useState } from "react";
import "../stylesheet/Style.css";
import Navbar from "../Components/Navbar";
import StarterPage from "../Components/StarterComponent";
import AboutPage from "../Components/About";
import ContactPage from "../Components/Contact";
import Footer from "../Components/Footer";
import PaperSubmissionForm from "../forms/PaperSubmissionForm";
import ArticlePage from "../forms/ArticlePage";
// import HistoryPage from "../viewerComponents/HistoryPage";
import ViewerHistoryPage from "../viewerComponents/ViewerHistoryPage";

const ViewerDashboard = () => {
  const viewerLoggedIn = localStorage.getItem("viewer");
  const [renderType, setRenderType] = useState("home");

  // const renderedComponent = () => {
  //   switch (renderType) {
  //     // case "home":
  //     //   return <HistoryPage />;
  //     case "submit-paper":
  //       return <PaperSubmissionForm />;
  //     case "article-paper":
  //       return <ArticlePage />;
  //     default:
  //       return null;
  //   }
  // };

  return (
    <div className="home-page">
      {/* ----------------------------------NavBar Section------------------------------ */}
      <div>
        <Navbar setRender={setRenderType} />
      </div>
      <div className="content">
        {viewerLoggedIn ? (
          <>
            <ViewerHistoryPage />
          </>
        ) : (
          <>
            {/* ----------------------------------Starter Section------------------------------ */}
            <div>
              <StarterPage />
            </div>
            {/* ----------------------------------About Section------------------------------ */}
            <div>
              <AboutPage />
            </div>
            {/* ------------------------------------Contact section---------------------------- */}
            <div>
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
  );
};

export default ViewerDashboard;
