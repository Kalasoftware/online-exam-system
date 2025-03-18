import { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Typography
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  // Update axios calls
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/users.php`);
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleOpenDialog = (user = null) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role
      });
    } else {
      setSelectedUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'student'
      });
    }
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    try {
      const url = selectedUser
        ? 'http://localhost/online_exam/api/admin/update-user.php'
        : 'http://localhost/online_exam/api/admin/create-user.php';

      const response = await axios.post(url, {
        ...formData,
        user_id: selectedUser?.user_id
      });

      if (response.data.success) {
        setOpenDialog(false);
        fetchUsers();
      }
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await axios.post('http://localhost/online_exam/api/admin/delete-user.php', {
          user_id: userId
        });
  
        if (response.data.success) {
          // Refresh user list after successful deletion
          fetchUsers();
        } else {
          alert(response.data.message || 'Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user. Please try again.');
      }
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        User Management
      </Typography>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => handleOpenDialog()}
        sx={{ mb: 2 }}
      >
        Add New User
      </Button>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.user_id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(user)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteUser(user.user_id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {selectedUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="teacher">Teacher</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default UserManagement;