import ArticlePage from "./forms/ArticlePage";
import PaperSubmissionForm from "./forms/PaperSubmissionForm";
// import Chat from "./pages/Chat";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./LoginPages/SignIn";
import SignUp from "./LoginPages/SignUp";
import Dashboard from "./admin/Dashboard";
import Home from "./pages/Home";
import UserProfile from "./pages/UserProfile";
import ForgotPassword from "./Components/ForgotPassword";
import UserResetPassword from "./Components/ResetPassword";
import Viewer_Login from "./admin/admin-SubComponents/Viewer_Login";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route Component={Home} path="/" />
          <Route Component={UserProfile} path="/UserProfile" />
          <Route Component={ForgotPassword} path="/forgot-password" />
          <Route Component={UserResetPassword} path="/UserResetPassword/:token" />
          <Route Component={SignIn} path="/signin" />
          <Route Component={SignUp} path="/SignUp" />
          <Route Component={ArticlePage} path="/ArticlePage" />
          <Route Component={PaperSubmissionForm} path="/PaperSubmissionForm" />
          <Route Component={Dashboard} path="/Dashboard" />
          <Route Component={Viewer_Login} path="/Viewer_Login" />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
