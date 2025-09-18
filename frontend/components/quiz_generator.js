import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Card,
  CardContent
} from "@mui/material";
import axios from "axios";

function QuizGenerator() {
  const [file, setFile] = useState(null);
  const [numQuestions, setNumQuestions] = useState(5);
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});
  const [review, setReview] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!file) return alert("Please upload a PDF.");

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("action", "quiz");
    formData.append("num_questions", numQuestions);

    setLoading(true);
    setQuiz([]);
    setReview([]);
    setSubmitted(false);

    try {
      const res = await axios.post("http://localhost:5000/process_pdf", formData);
      setQuiz(res.data.questions);
    } catch (err) {
      console.error(err);
      alert("Error generating quiz.");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionClick = (qIdx, optionKey) => {
    if (!submitted) {
      setAnswers((prev) => ({ ...prev, [qIdx]: optionKey }));
    }
  };

  const handleReview = () => {
    const formatted = quiz.map((q, idx) => ({
      id: idx + 1,
      answer: q.options[answers[idx]],
      correct_answer: q.options[q.correct_answer],
      explanation: q.explanation
    }));
    setReview(formatted);
    setSubmitted(true);
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
      {/* Processing Overlay */}
      {loading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "rgba(0,0,0,0.85)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Typography variant="h4" sx={{ color: "#fff" }}>
            Processing...
          </Typography>
        </Box>
      )}

      <Typography variant="h4" gutterBottom>
        Generate Quiz
      </Typography>
      <Paper sx={{ p: 3, mt: 2, backgroundColor: "#1e1e1e" }}>
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
        <Typography sx={{ mt: 2, color: "#fff" }}>
          Number of Questions:
        </Typography>
        <input
          type="number"
          min="1"
          max="20"
          value={numQuestions}
          onChange={(e) => setNumQuestions(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "8px",
            backgroundColor: "#333",
            color: "#fff",
            border: "1px solid #555",
            borderRadius: "4px"
          }}
        />
        <Button
          variant="contained"
          sx={{
            mt: 2,
            bgcolor: "#1976d2",
            "&:hover": { bgcolor: "#1565c0" }
          }}
          onClick={handleSubmit}
          disabled={loading}
        >
          Generate Quiz
        </Button>
      </Paper>

      {quiz.length > 0 && (
        <Box mt={3}>
          {quiz.map((q, idx) => (
            <Card key={idx} sx={{ mb: 2, backgroundColor: "#1e1e1e" }}>
              <CardContent>
                <Typography fontWeight="bold" sx={{ mb: 1, color: "#fff" }}>
                  Q{idx + 1}: {q.question}
                </Typography>
                {Object.entries(q.options).map(([key, value]) => {
                  const selected = answers[idx] === key;
                  const isCorrect = submitted && key === q.correct_answer;
                  const isWrong = submitted && selected && key !== q.correct_answer;

                  let bgColor = "#2c2c2c";
                  if (isCorrect) bgColor = "#2e7d32";
                  if (isWrong) bgColor = "#c62828";
                  if (selected && !submitted) bgColor = "#444";

                  return (
                    <Box
                      key={key}
                      onClick={() => handleOptionClick(idx, key)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 1.2,
                        my: 0.7,
                        borderRadius: "6px",
                        bgcolor: bgColor,
                        cursor: submitted ? "default" : "pointer",
                        border: selected ? "1px solid #888" : "1px solid transparent",
                        "&:hover": {
                          bgcolor: !submitted && "#555"
                        },
                        transition: "background-color 0.2s ease"
                      }}
                    >
                      <Typography sx={{ color: "#fff", flex: 1 }}>
                        {`${key}: ${value}`}
                      </Typography>
                    </Box>
                  );
                })}
              </CardContent>
            </Card>
          ))}
          {!submitted && (
            <Button
              variant="contained"
              sx={{
                mt: 2,
                bgcolor: "#43a047",
                "&:hover": { bgcolor: "#388e3c" }
              }}
              onClick={handleReview}
            >
              Review Answers
            </Button>
          )}

          {review.length > 0 && (
            <Box mt={3}>
              {review.map((item, idx) => (
                <Paper
                  key={idx}
                  sx={{ mb: 2, p: 2, backgroundColor: "#1e1e1e" }}
                >
                  <Typography sx={{ fontWeight: "bold", color: "#fff" }}>
                    Q{item.id}:{" "}
                    {item.answer === item.correct_answer
                      ? "✅ Correct"
                      : "❌ Incorrect"}
                  </Typography>
                  {item.answer !== item.correct_answer && (
                    <>
                      <Typography sx={{ mt: 1, color: "#ddd" }}>
                        Your Answer: {item.answer}
                      </Typography>
                      <Typography sx={{ color: "#ddd" }}>
                        Correct Answer: {item.correct_answer}
                      </Typography>
                      <Typography
                        sx={{
                          fontStyle: "italic",
                          mt: 1,
                          color: "#f0e68c"
                        }}
                      >
                        Explanation:{" "}
                        {item.explanation
                          .replace(/^According to the text[:,]?\s*/i, "")
                          .replace(/^because/i, "")
                          .trim()}
                      </Typography>
                    </>
                  )}
                </Paper>
              ))}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}

export default QuizGenerator;
