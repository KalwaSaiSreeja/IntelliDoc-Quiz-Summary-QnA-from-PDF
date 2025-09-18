import React from "react";
import { AppBar, Toolbar, Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navMap = {
    "/summarize": ["Quiz Generator", "Q&A"],
    "/quiz": ["Summarize", "Q&A"],
    "/qna": ["Summarize", "Quiz Generator"],
  };

  const current = navMap[location.pathname] || [];

  return (
    <AppBar position="static" sx={{ background: "#111" }}>
      <Toolbar>
        <Button color="inherit" onClick={() => navigate("/")}>Home</Button>
        {current.map((label) => (
          <Button
            key={label}
            color="inherit"
            onClick={() => {
              if (label === "Summarize") navigate("/summarize");
              else if (label === "Quiz Generator") navigate("/quiz");
              else if (label === "Q&A") navigate("/qna");
            }}
          >
            {label}
          </Button>
        ))}
      </Toolbar>
    </AppBar>
  );
}
