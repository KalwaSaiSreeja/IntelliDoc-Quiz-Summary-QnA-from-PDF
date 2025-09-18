import React from "react";
import { Container, Grid, Card, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import robotAnimation from "../robot.json";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d0d0d",
        color: "#fff",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Lottie animationData={robotAnimation} style={{ width: 300 }} />
      <Typography variant="h3" gutterBottom>
        SMART READ
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {[
          { title: "Summarize", path: "/summarize" },
          { title: "Quiz Generator", path: "/quiz" },
          { title: "Q&A", path: "/qna" },
        ].map((item) => (
          <Grid item key={item.title}>
            <Card
              sx={{
                background: "#222",
                color: "#fff",
                width: 250,
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": { transform: "scale(1.05)", background: "#333" },
              }}
              onClick={() => navigate(item.path)}
            >
              <CardContent>
                <Typography align="center">{item.title}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
