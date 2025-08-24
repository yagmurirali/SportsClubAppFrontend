import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AdminPanel from "./pages/AdminPanel"; 
import MemberPanel from "./pages/MemberPanel"; 
import 'leaflet/dist/leaflet.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/member" element={<MemberPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
