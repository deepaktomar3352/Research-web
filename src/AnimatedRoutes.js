import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import SignIn from "./LoginPages/SignIn";
import SignUp from "./LoginPages/SignUp";
import Dashboard from "./admin/Dashboard";
import Home from "./pages/Home";
import UserProfile from "./pages/UserProfile";
import ForgotPassword from "./Components/ForgotPassword";
import UserResetPassword from "./Components/ResetPassword";
import ViewerDashboard from "./pages/ViewerDashboard";
import { AnimatePresence } from "framer-motion";
import ArticlePage from "./forms/ArticlePage";
import PaperSubmissionForm from "./forms/PaperSubmissionForm";
import AdminProfile from "./admin/AdminProfile";
// import Paper_AcceptedSection from "./user_components/Paper_AcceptedSection";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route Component={Home} path="/" />
        <Route Component={UserProfile} path="/UserProfile" />
        <Route Component={ForgotPassword} path="/forgot-password" />
        <Route Component={UserResetPassword} path="/UserResetPassword/:token" />
        <Route Component={SignIn} path="/signin" />
        <Route Component={SignUp} path="/SignUp" />
        <Route Component={ArticlePage} path="/ArticlePage" />
        <Route Component={PaperSubmissionForm} path="/PaperSubmissionForm" />
        <Route Component={Dashboard} path="/Dashboard" />
        <Route Component={ViewerDashboard} path="/ViewerDashboard" />
        <Route Component={AdminProfile} path="/AdminProfile" />
        {/* <Route Component={Paper_AcceptedSection} path="/Paper_AcceptedSection" /> */}
      </Routes>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;
