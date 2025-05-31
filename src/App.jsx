import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SplashPage from "./screens/SplashPage";
import SearchPage from "./screens/SearchPage";
import CreatePostPage from "./screens/CreatePostPage";
import SearchPageDetail from "./screens/SearchPageDetail";
// import PostTest from "./screens/PostTest";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/searchdetail" element={<SearchPageDetail />} />
        <Route path="/post" element={<CreatePostPage />} />
        {/* <Route path="/posttest" element={<PostTest />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
