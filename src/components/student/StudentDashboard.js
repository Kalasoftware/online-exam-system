import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, Typography, Button, Grid } from '@mui/material';
import API_BASE_URL from '../../config/api';
import axios from 'axios';

const StudentDashboard = () => {
  const navigate = useNavigate();

  const goToAvailableExams = () => {
    navigate('/student/available-exams');
  };

  // Update axios calls
  const fetchExams = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/student/available-exams.php`);
      // ... rest of the code
    } catch (error) {
      // ... error handling
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Student Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Button
            variant="contained"
            fullWidth
            onClick={goToAvailableExams}
            sx={{ p: 2 }}
          >
            Available Exams
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default StudentDashboard;