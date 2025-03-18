import React from 'react';
import { Container, Typography, Paper, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.name || 'User'}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 200 }}>
            <Typography variant="h6" gutterBottom>
              Available Exams
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/exams')}
              sx={{ mt: 2 }}
            >
              View Exams
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 200 }}>
            <Typography variant="h6" gutterBottom>
              Your Results
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/results')}
              sx={{ mt: 2 }}
            >
              View Results
            </Button>
          </Paper>
        </Grid>
        {user?.role === 'admin' && (
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 200 }}>
              <Typography variant="h6" gutterBottom>
                Admin Panel
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => navigate('/admin')}
                sx={{ mt: 2 }}
              >
                Manage System
              </Button>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default Dashboard;