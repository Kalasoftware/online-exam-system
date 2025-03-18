import { useState } from 'react';
import { TextField, Button, Container, Paper, Typography, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminRegister() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    admin_code: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost/online_exam/api/admin/create-admin.php', formData);
      
      if (response.data.success) {
        alert('Admin registration successful');
        navigate('/login');
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Admin Registration
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Admin Code"
            name="admin_code"
            type="password"
            value={formData.admin_code}
            onChange={handleChange}
            margin="normal"
            required
            helperText="Please enter the admin registration code"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Register Admin
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default AdminRegister;