import API_BASE_URL from '../../config/api';
// ... other imports

// Update axios calls
const fetchExamQuestions = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/student/exam-questions.php?exam_id=${examId}`);
    // ... rest of the code
  } catch (error) {
    // ... error handling
  }
};