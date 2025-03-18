import { useState, useEffect } from 'react';
import { TextField, Button, Container, Paper, Typography, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, login } = useAuth();  // Add login from useAuth

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (!email || !password) {
        setError('Please fill in all fields');
        return;
      }

      const response = await axios.post('http://localhost/online_exam/api/login.php', {
        email: email.trim(),
        password: password.trim()
      });
      
      if (response.data.success === true && response.data.user) {
        login(response.data.user);  // Use login function instead of localStorage
        navigate('/dashboard');
      } else {
        setError(response.data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        setError(`Server error: ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError('Error: ' + error.message);
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Online Examination System
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Login
          </Button>
          <Button
            component={Link}
            to="/register"
            color="secondary"
            fullWidth
            sx={{ mt: 1 }}
          >
            New user? Register here
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default Login;