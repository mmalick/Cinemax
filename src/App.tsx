import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import useUserAuth from "./hooks/userAuth";

import AuthScreen from "./pages/AuthScreen";
import HomePage from "./pages/HomePage";
import FilmsPage from "./pages/FilmsPage";
import MovieDetailsPage from "./pages/MovieDetailsPage";

const App: React.FC = () => {
  return (
    <Router>
      <AuthWrapper /> {/* Nowy komponent obsługujący wylogowanie */}
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/oscar" element={<HomePage />} />
        <Route path="/login" element={<AuthScreen />} />
        <Route path="/signup" element={<AuthScreen isSignUp />} />
        <Route path="/films" element={<FilmsPage />} />
        <Route path="/movie/:id" element={<MovieDetailsPage />} />
      </Routes>
    </Router>
  );
};

// Komponent obsługujący autoryzację
const AuthWrapper = () => {
  useUserAuth(); // Teraz działa poprawnie wewnątrz Routera
  return null; // Nie renderuje nic, ale wykonuje logikę
};

export default App;
