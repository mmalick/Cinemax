import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AuthScreen from "./pages/AuthScreen";
import HomePage from "./pages/HomePage";
import FilmsPage from "./pages/FilmsPage";
import MovieDetailsPage from "./pages/MovieDetailsPage"; // Import nowej strony

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/oscar" element={<HomePage />} />
        <Route path="/login" element={<AuthScreen />} />
        <Route path="/signup" element={<AuthScreen isSignUp />} />
        <Route path="/films" element={<FilmsPage />} />
        <Route path="/movie/:id" element={<MovieDetailsPage />} /> {/* Nowy route */}
      </Routes>
    </Router>
  );
}

export default App;
