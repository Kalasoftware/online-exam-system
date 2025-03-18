import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button
} from '@mui/material';
import axios from 'axios';

function AvailableExams() {
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  const fetchAvailableExams = async () => {
    try {
      console.log('Fetching exams...');
      const response = await axios.get('http://localhost/online_exam/api/student/available-exams.php');
      
      console.log('Raw API Response:', response.data);
      
      if (response.data.success && Array.isArray(response.data.exams)) {
        const formattedExams = response.data.exams.map(exam => ({
          exam_id: exam.exam_id,
          exam_name: exam.exam_name,
          subject: exam.subject,
          duration: exam.duration,
          exam_date: exam.exam_date,
          teacher_name: exam.teacher_name || 'Not Assigned'
        }));
        
        console.log('Formatted Exams:', formattedExams);
        setExams(formattedExams);
      } else {
        console.error('Invalid data structure:', response.data);
        setExams([]);
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
      setExams([]);
    }
  };

  useEffect(() => {
    fetchAvailableExams();
  }, []);

  const handleStartExam = (examId) => {
    navigate(`/student/exam/${examId}`);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Available Exams
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Exam Name</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Duration (mins)</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell>Teacher</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {exams.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No exams available</TableCell>
              </TableRow>
            ) : (
              exams.map((exam) => (
                <TableRow key={exam.exam_id}>
                  <TableCell>{exam.exam_name}</TableCell>
                  <TableCell>{exam.subject}</TableCell>
                  <TableCell>{exam.duration}</TableCell>
                  <TableCell>{new Date(exam.exam_date).toLocaleString()}</TableCell>
                  <TableCell>{exam.teacher_name}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleStartExam(exam.exam_id)}
                    >
                      Start Exam
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default AvailableExams;