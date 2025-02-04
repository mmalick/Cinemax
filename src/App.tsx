//import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar/Navbar';
import HomePage from './pages/HomePage';


function App() {
  return (
    <div>
      <Navbar />
      <HomePage />
      {/* Pozostałe komponenty */}
    </div>
  );
}

export default App;
