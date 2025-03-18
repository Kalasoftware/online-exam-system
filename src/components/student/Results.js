import API_BASE_URL from '../../config/api';
// ... other imports

// Update axios calls
const fetchResults = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/student/results.php`);
    // ... rest of the code
  } catch (error) {
    // ... error handling
  }
};