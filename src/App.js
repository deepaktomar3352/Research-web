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
import ViewerDashboard from "./pages/ViewerDashboard";

import AnimatedRoutes from "./AnimatedRoutes";
function App() {
  // const location = useLocation();

  return (
    <div className="App">
      <Router>
       <AnimatedRoutes/>
      </Router>
    </div>
  );
}

export default App;
