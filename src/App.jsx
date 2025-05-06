import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SplashPage from "./screens/SplashPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashPage />} />
      </Routes>
    </Router>
  );
}

export default App;
