import React, { useState } from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
import axios from "axios";

function QnaGenerator() {
  const [file, setFile] = useState(null);
  const [qna, setQna] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!file) return alert("Please upload a PDF.");

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("action", "qna");

    setLoading(true);
    setQna([]);

    try {
      const res = await axios.post("http://localhost:5000/process_pdf", formData);
      setQna(res.data.qna);
    } catch (err) {
      console.error(err);
      alert("Error generating Q&A.");
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
        position: "relative"
      }}
    >
      {loading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10
          }}
        >
          <Typography variant="h5" sx={{ color: "#fff" }}>
            Processing...
          </Typography>
        </Box>
      )}

      <Typography variant="h4" gutterBottom>
        Generate Q&A
      </Typography>
      <Paper
        sx={{
          p: 3,
          mt: 2,
          backgroundColor: "#1e1e1e",
          color: "#fff"
        }}
      >
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ color: "#fff" }}
        />
        {file && (
          <Typography sx={{ mt: 1, fontSize: "0.9rem", color: "#ccc" }}>
            {file.name}
          </Typography>
        )}
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleSubmit}
          disabled={loading}
        >
          Generate Q&A
        </Button>
      </Paper>

      {qna.length > 0 && (
        <Box mt={3}>
          {qna.map((item, idx) => (
            <Paper
              key={idx}
              sx={{
                mb: 2,
                p: 2,
                backgroundColor: "#1e1e1e",
                color: "#fff"
              }}
            >
              <Typography fontWeight="bold">
                Q{idx + 1}: {item.question}
              </Typography>
              <Typography>
                Answer: {item.answer}
              </Typography>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default QnaGenerator;
