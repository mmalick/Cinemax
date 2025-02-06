import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AuthScreen from "./pages/AuthScreen";
import HomePage from "./pages/HomePage";
import FilmsPage from "./pages/FilmsPage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage title="Popular on Watch" />} />
        <Route path="/oscar" element={<HomePage title="Oscar nominated" />} />
        <Route path="/login" element={<AuthScreen />} />
        <Route path="/signup" element={<AuthScreen isSignUp />} />
        <Route path="/films" element={<FilmsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
