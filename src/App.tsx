import "./App.css";
import Navbar from "./components/ReusableUI/Navbar/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import useUserAuth from "./components/Auth/userAuth";

import AuthScreen from "./components/Auth/AuthScreen";
import HomePage from "./pages/HomePage";
import FilmsPage from "./pages/FilmsPage";
import MovieDetailsPage from "./pages/MovieDetailsPage";
import ListsPage from "./pages/ListsPage";
import ListDetailsPage from "./pages/ListDetailsPage";

const App: React.FC = () => {
  return (
    <Router>
      <AuthWrapper />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthScreen />} />
        <Route path="/signup" element={<AuthScreen isSignUp />} />
        <Route path="/films" element={<FilmsPage />} />
        <Route path="/lists" element={<ListsPage/>} />
        <Route path="/movie/:id" element={<MovieDetailsPage />} />
        <Route path="/list/:id" element={<ListDetailsPage />} />
      </Routes>
    </Router>
  );
};

const AuthWrapper = () => {
  useUserAuth(); 
  return null;
};

export default App;
