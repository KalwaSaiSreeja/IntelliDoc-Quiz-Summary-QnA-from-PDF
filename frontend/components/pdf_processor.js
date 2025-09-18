import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';

export default function PdfProcessor() {
  const [file, setFile] = useState(null);
  const [numQuestions, setNumQuestions] = useState(5);
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!file) return alert('Please upload a PDF!');
    setLoading(true);
    setQuiz([]);
    setSubmitted(false);

    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('action', 'quiz');
    formData.append('num_questions', numQuestions);

    try {
      const res = await axios.post('http://localhost:5000/process_pdf', formData);
      console.log('API Response:', res.data);
      if (res.data.questions) {
        setQuiz(res.data.questions);
      } else {
        alert('No quiz questions returned.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleOption = (qid, optionKey) => {
    if (!submitted) {
      setAnswers((prev) => ({ ...prev, [qid]: optionKey }));
    }
  };

  const handleScore = () => {
    setSubmitted(true);
  };

  return (
    <Box sx={{ bgcolor: '#121212', minHeight: '100vh', p: 4 }}>
      <Typography variant="h4" color="white" gutterBottom>
        Generate Quiz
      </Typography>

      <Box
        sx={{
          bgcolor: '#1e1e1e',
          p: 3,
          borderRadius: 2,
          maxWidth: 500,
          mx: 'auto',
        }}
      >
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ marginBottom: '1rem', color: 'white' }}
        />
        <Typography variant="body1" color="white" sx={{ mb: 1 }}>
          Number of Questions:
        </Typography>
        <input
          type="number"
          min="1"
          max="20"
          value={numQuestions}
          onChange={(e) =>
            setNumQuestions(
              Math.max(1, Math.min(20, parseInt(e.target.value) || 1))
            )
          }
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #555',
            marginBottom: '1rem',
            color: 'white',
            backgroundColor: '#2c2c2c',
          }}
        />
        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <CircularProgress size={20} sx={{ color: '#fff', mr: 1 }} />
              Processing...
            </>
          ) : (
            'SUBMIT'
          )}
        </Button>
      </Box>

      {quiz.length > 0 && (
        <Box sx={{ mt: 4 }}>
          {quiz.map((q, idx) => (
            <Card
              key={idx}
              sx={{
                bgcolor: '#1e1e1e',
                color: 'white',
                mb: 2,
                border: '1px solid #333',
              }}
            >
              <CardContent>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  Q{idx + 1}: {q.question}
                </Typography>
                {Object.entries(q.options).map(([key, value]) => {
                  let bg = '#2c2c2c';
                  if (submitted) {
                    if (key === q.correct_answer) {
                      bg = 'green';
                    } else if (answers[idx] === key) {
                      bg = 'red';
                    }
                  } else if (answers[idx] === key) {
                    bg = '#555';
                  }
                  return (
                    <Box
                      key={key}
                      onClick={() => handleOption(idx, key)}
                      sx={{
                        p: 1,
                        my: 0.5,
                        borderRadius: '4px',
                        bgcolor: bg,
                        cursor: submitted ? 'default' : 'pointer',
                        border:
                          answers[idx] === key
                            ? '1px solid #888'
                            : '1px solid transparent',
                      }}
                    >
                      {`${key}. ${value}`}
                    </Box>
                  );
                })}
              </CardContent>
            </Card>
          ))}

          {!submitted && (
            <Button
              variant="contained"
              color="success"
              onClick={handleScore}
              sx={{ mt: 2 }}
            >
              Submit Answers
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
}
