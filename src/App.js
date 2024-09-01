import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import TimedMode from "./components/TimedMode";
import RaceMode from "./components/RaceMode";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/timed" element={<TimedMode />} />
        <Route path="/race" element={<RaceMode />} />
      </Routes>
    </Router>
  );
}

export default App;
