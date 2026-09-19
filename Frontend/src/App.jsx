import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./features/interview/pages/Home";
import Pricing from "./features/interview/pages/Pricing";
import Tools from "./features/interview/pages/Tools";
import Navbar from "./features/interview/pages/Navbar";
import Footer from "./features/interview/pages/Footer";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import { InterviewProvider } from "./features/interview/interview.context";
import { AuthProvider } from "./features/auth/auth.context";
import { ThemeProvider } from "./context/theme.context";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <InterviewProvider>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
            <Footer />
          </Router>
        </InterviewProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;