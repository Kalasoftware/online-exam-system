import API_BASE_URL from '../../config/api';
// ... other imports

// Update axios calls
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login.php`, {
      username,
      password
    });
    // ... rest of the code
  } catch (error) {
    // ... error handling
  }
};