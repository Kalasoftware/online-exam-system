import { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import { Add, Edit, Delete, Assignment } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Add this import
import API_BASE_URL from '../../config/api';

const ExamManagement = () => {
  const navigate = useNavigate(); // Add this line
  const [exams, setExams] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  // Update the formData state
  // Add status field to formData
  const [formData, setFormData] = useState({
    exam_name: '',
    subject: '',
    exam_date: '',
    duration: 60,
    teacher_id: null,
    status: 'active'
  });
  
  // Add status field in Dialog content
  <Grid item xs={12}>
    <FormControl fullWidth>
      <InputLabel>Status</InputLabel>
      <Select
        value={formData.status || 'active'}
        label="Status"
        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
      >
        <MenuItem value="active">Active</MenuItem>
        <MenuItem value="draft">Draft</MenuItem>
        <MenuItem value="completed">Completed</MenuItem>
      </Select>
    </FormControl>
  </Grid>

  useEffect(() => {
    fetchExams();
  }, []);

  // Update axios calls in the component
  const fetchExams = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/exams.php`);
      if (response.data.success) {
        setExams(response.data.exams);
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };

  const handleOpenDialog = (exam = null) => {
    if (exam) {
      setSelectedExam(exam);
      setFormData({
        exam_id: exam.exam_id, // Add this line
        exam_name: exam.exam_name,
        subject: exam.subject,
        duration: exam.duration,
        exam_date: exam.exam_date,
        teacher_id: exam.teacher_id,
        status: exam.status || 'active'
      });
    } else {
      setSelectedExam(null);
      setFormData({
        exam_name: '',
        subject: '',
        exam_date: '',
        duration: 60,
        teacher_id: null,
        status: 'active'
      });
    }
    setOpenDialog(true);
  };

  const [editMode, setEditMode] = useState(false);
  const [examData, setExamData] = useState({
    title: '',
    description: '',
    duration: '',
    start_time: '',
    end_time: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (editMode) {
        response = await axios.post(`${API_BASE_URL}/admin/update-exam.php`, examData);
      } else {
        response = await axios.post(`${API_BASE_URL}/admin/create-exam.php`, examData);
      }
      if (response.data.success) {
        // Handle success
        fetchExams(); // Refresh the exams list
        setExamData({
          title: '',
          description: '',
          duration: '',
          start_time: '',
          end_time: ''
        });
        setEditMode(false);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (examId) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      try {
        const response = await axios.post('http://localhost/online_exam/api/admin/delete-exam.php', {
          exam_id: examId
        });

        if (response.data.success) {
          fetchExams();
        }
      } catch (error) {
        console.error('Error deleting exam:', error);
      }
    }
  };

  const handleManageQuestions = (examId) => {
    navigate(`/admin/exam/${examId}/questions`); // Update this line
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Exam Management
      </Typography>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => handleOpenDialog()}
        sx={{ mb: 2 }}
      >
        Create New Exam
      </Button>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Exam Name</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Duration (mins)</TableCell>
              <TableCell>Exam Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {exams.map((exam) => (
              <TableRow key={exam.exam_id}>
                <TableCell>{exam.exam_name}</TableCell>
                <TableCell>{exam.subject}</TableCell>
                <TableCell>{exam.duration}</TableCell>
                <TableCell>{new Date(exam.exam_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(exam)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(exam.exam_id)}>
                    <Delete />
                  </IconButton>
                  <IconButton onClick={() => handleManageQuestions(exam.exam_id)}>
                    <Assignment />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedExam ? 'Edit Exam' : 'Create New Exam'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Exam Name"
                value={formData.exam_name}
                onChange={(e) => setFormData({ ...formData, exam_name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Duration (minutes)"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Exam Date & Time"
                type="datetime-local"
                value={formData.exam_date}
                onChange={(e) => setFormData({ ...formData, exam_date: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            // In the Dialog content, add this before the last Grid item
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
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

export default ExamManagement;