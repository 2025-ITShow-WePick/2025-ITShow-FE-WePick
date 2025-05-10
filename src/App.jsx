import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SplashPage from "./screens/SplashPage";
import SearchPage from "./screens/SearchPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </Router>
  );
}

export default App;
