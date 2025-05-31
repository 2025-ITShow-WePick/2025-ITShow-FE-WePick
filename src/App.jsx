import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SplashPage from "./screens/SplashPage";
import SearchPage from "./screens/SearchPage";
<<<<<<< Updated upstream
import CreatePostPage from "./screens/CreatePostPage";
import SearchPageDetail from "./screens/SearchPageDetail";
=======
import CreatePostPage2 from "./screens/CreatePostPage";
>>>>>>> Stashed changes
// import PostTest from "./screens/PostTest";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/search" element={<SearchPage />} />
<<<<<<< Updated upstream
        <Route path="/searchdetail" element={<SearchPageDetail />} />
        <Route path="/post" element={<CreatePostPage />} />
        {/* <Route path="/posttest" element={<PostTest />} /> */}
=======
        <Route path="/post" element={<CreatePostPage2 />} />
>>>>>>> Stashed changes
      </Routes>
    </Router>
  );
}

export default App;
