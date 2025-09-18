import React, { useState } from "react";
import { Box, Button, Typography, Paper, CircularProgress } from "@mui/material";
import axios from "axios";

function Summarize() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (summaryLevel) => {
    if (!file) return alert("Please upload a PDF.");

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("action", "summarize");
    formData.append("summary_level", summaryLevel);

    setLoading(true);
    setSummary("");

    try {
      const res = await axios.post("http://localhost:5000/process_pdf", formData);
      setSummary(res.data.summary);
    } catch (err) {
      console.error(err);
      alert("Error generating summary.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        p: 4,
        color: "#fff",
        minHeight: "100vh",
        backgroundColor: "#121212",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      <Typography variant="h4" gutterBottom>
        Summarize PDF
      </Typography>

      <Paper sx={{ p: 3, mt: 2, backgroundColor: "#1e1e1e", width: "100%", maxWidth: 600 }}>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ color: "#fff" }}
        />
        {file && (
          <Typography sx={{ mt: 1, color: "#ccc", fontSize: "0.9rem" }}>
            {file.name}
          </Typography>
        )}
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
          <Button
            variant="contained"
            sx={{
              mt: 2,
              mr: 2,
              backgroundColor: "#1976d2",
              "&:hover": {
                backgroundColor: "#1565c0"
              }
            }}
            onClick={() => handleSubmit("summary")}
            disabled={loading}
          >
            Summarize
          </Button>
          <Button
            variant="outlined"
            sx={{
              mt: 2,
              borderColor: "#1976d2",
              color: "#1976d2",
              "&:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.1)",
                borderColor: "#1565c0"
              }
            }}
            onClick={() => handleSubmit("abstract")}
            disabled={loading}
          >
            Generate Abstract
          </Button>
        </Box>
      </Paper>

      {loading && (
        <Box
          sx={{
            mt: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <CircularProgress color="inherit" />
          <Typography sx={{ mt: 2, color: "#fff" }}>Processing...</Typography>
        </Box>
      )}

      {summary && (
        <Paper sx={{ mt: 3, p: 2, backgroundColor: "#1e1e1e", maxWidth: 600 }}>
          <Typography sx={{ color: "#fff" }}>{summary}</Typography>
        </Paper>
      )}
    </Box>
  );
}

export default Summarize;
