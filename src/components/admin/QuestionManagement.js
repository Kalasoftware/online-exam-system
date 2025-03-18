import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import axios from 'axios';
import { Snackbar, Alert } from '@mui/material';
import API_BASE_URL from '../../config/api';

function QuestionManagement() {
  const { examId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_answer: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [editQuestionId, setEditQuestionId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchQuestions();
  }, [examId]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/questions.php?exam_id=${examId}`);
      if (response.data.success) {
        setQuestions(response.data.questions);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        const response = await axios.post(`${API_BASE_URL}/admin/update-question.php`, {
          ...newQuestion,
          question_id: editQuestionId,
          exam_id: examId
        });
        if (response.data.success) {
          setSnackbar({
            open: true,
            message: 'Question updated successfully',
            severity: 'success'
          });
        }
      } else {
        const response = await axios.post(`${API_BASE_URL}/admin/create-question.php`, {
          ...newQuestion,
          exam_id: examId
        });
        if (response.data.success) {
          setSnackbar({
            open: true,
            message: 'Question added successfully',
            severity: 'success'
          });
        }
      }
      setNewQuestion({
        question_text: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_answer: ''
      });
      setEditMode(false);
      setEditQuestionId(null);
      fetchQuestions();
    } catch (error) {
      console.error('Error saving question:', error);
      setSnackbar({
        open: true,
        message: 'Error saving question: ' + (error.response?.data?.message || error.message),
        severity: 'error'
      });
    }
  };

  const handleEdit = (question) => {
    setNewQuestion({
      question_text: question.question_text,
      option_a: question.option_a,
      option_b: question.option_b,
      option_c: question.option_c,
      option_d: question.option_d,
      correct_answer: question.correct_answer
    });
    setEditMode(true);
    setEditQuestionId(question.question_id);
  };

  const handleDelete = async (questionId) => {
    try {
      await axios.post(`${API_BASE_URL}/admin/delete-question.php`, {
        question_id: questionId
      });
      fetchQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  // Add this at the end of the return statement, before the closing Paper tag
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {editMode ? 'Edit Question' : 'Add New Question'}
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Question Text"
              name="question_text"
              value={newQuestion.question_text}
              onChange={handleInputChange}
              required
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Option A"
              name="option_a"
              value={newQuestion.option_a}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Option B"
              name="option_b"
              value={newQuestion.option_b}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Option C"
              name="option_c"
              value={newQuestion.option_c}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Option D"
              name="option_d"
              value={newQuestion.option_d}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <Typography variant="subtitle1">Correct Answer</Typography>
              <RadioGroup
                row
                name="correct_answer"
                value={newQuestion.correct_answer}
                onChange={handleInputChange}
              >
                <FormControlLabel value="A" control={<Radio />} label="A" />
                <FormControlLabel value="B" control={<Radio />} label="B" />
                <FormControlLabel value="C" control={<Radio />} label="C" />
                <FormControlLabel value="D" control={<Radio />} label="D" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              {editMode ? 'Update Question' : 'Add Question'}
            </Button>
            {editMode && (
              <Button
                sx={{ ml: 1 }}
                variant="outlined"
                onClick={() => {
                  setEditMode(false);
                  setEditQuestionId(null);
                  setNewQuestion({
                    question_text: '',
                    option_a: '',
                    option_b: '',
                    option_c: '',
                    option_d: '',
                    correct_answer: ''
                  });
                }}
              >
                Cancel Edit
              </Button>
            )}
          </Grid>
        </Grid>
      </form>

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        Questions List
      </Typography>
      <List>
        {questions.map((question, index) => (
          <ListItem key={question.question_id} divider>
            <ListItemText
              primary={`${index + 1}. ${question.question_text}`}
              secondary={
                <>
                  A: {question.option_a}<br />
                  B: {question.option_b}<br />
                  C: {question.option_c}<br />
                  D: {question.option_d}<br />
                  Correct Answer: {question.correct_answer}
                </>
              }
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => handleEdit(question)} sx={{ mr: 1 }}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" onClick={() => handleDelete(question.question_id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default QuestionManagement;