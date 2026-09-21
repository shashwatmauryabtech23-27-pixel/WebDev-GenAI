import { BrowserRouter as Router, Navigate, Routes, Route, useLocation } from "react-router-dom";
import Home from "./features/interview/pages/Home";
import Navbar from "./features/interview/pages/Navbar";
import Footer from "./features/interview/pages/Footer";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Interview from "./features/interview/pages/Interview";
import Protected from "./features/auth/components/Protected";
import { InterviewProvider } from "./features/interview/interview.context";
import { AuthProvider } from "./features/auth/auth.context";
import { ThemeProvider } from "./context/theme.context";

function AppRoutes() {
  const location = useLocation();
  const isWorkspace = location.pathname.startsWith("/interview/");
  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  return (
    <>
      {!isWorkspace && !isAuthPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Protected><Home /></Protected>} />
        <Route path="/interview/:interviewId" element={<Protected><Interview /></Protected>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!isWorkspace && !isAuthPage && <Footer />}
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <InterviewProvider>
          <Router>
            <AppRoutes />
          </Router>
        </InterviewProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
