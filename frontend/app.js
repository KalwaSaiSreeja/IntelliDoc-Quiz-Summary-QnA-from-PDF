
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import Home from "./components/Home";
import Summarize from "./components/Summarize";
import QuizGenerator from "./components/QuizGenerator";
import QnaGenerator from "./components/QnaGenerator";
import NavBar from "./components/NavBar"; // ✅ Import your NavBar

function App() {
  return (
    <Router>
      <NavBar />  {/* ✅ Use your NavBar here */}
      <Box>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/summarize" element={<Summarize />} />
          <Route path="/quiz" element={<QuizGenerator />} />
          <Route path="/qna" element={<QnaGenerator />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
