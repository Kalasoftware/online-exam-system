import { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button
} from '@mui/material';
import { DownloadOutlined } from '@mui/icons-material';
import axios from 'axios';

function Reports() {
  const [examStats, setExamStats] = useState({
    totalExams: 0,
    activeExams: 0,
    completedExams: 0
  });
  const [userStats, setUserStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    activeUsers: 0
  });
  const [recentResults, setRecentResults] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchRecentResults();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost/online_exam/api/admin/stats.php', {
        withCredentials: true
      });
      
      if (response.data.success) {
        // Update both exam and user stats
        setExamStats({
          totalExams: response.data.stats.total_exams || 0,
          activeExams: response.data.stats.active_exams || 0,
          completedExams: response.data.stats.completed_exams || 0
        });
        
        setUserStats({
          totalStudents: response.data.stats.total_students || 0,
          totalTeachers: response.data.stats.total_teachers || 0,
          activeUsers: response.data.stats.active_users || 0
        });
      } else {
        console.error('Failed to fetch stats:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchRecentResults = async () => {
    try {
      const response = await axios.get('http://localhost/online_exam/api/admin/recent-results.php');
      if (response.data.success) {
        setRecentResults(response.data.results);
      }
    } catch (error) {
      console.error('Error fetching recent results:', error);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await axios.get('http://localhost/online_exam/api/admin/download-report.php', {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'exam_report.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Reports & Analytics
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Exam Statistics</Typography>
              <Typography>Total Exams: {examStats.totalExams}</Typography>
              <Typography>Active Exams: {examStats.activeExams}</Typography>
              <Typography>Completed: {examStats.completedExams}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">User Statistics</Typography>
              <Typography>Total Students: {userStats.totalStudents}</Typography>
              <Typography>Total Teachers: {userStats.totalTeachers}</Typography>
              <Typography>Active Users: {userStats.activeUsers}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Button
        variant="contained"
        startIcon={<DownloadOutlined />}
        onClick={handleDownloadReport}
        sx={{ mb: 2 }}
      >
        Download Full Report
      </Button>

      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Recent Exam Results
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student Name</TableCell>
              <TableCell>Exam Title</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentResults.map((result) => (
              <TableRow key={result.result_id}>
                <TableCell>{result.student_name}</TableCell>
                <TableCell>{result.exam_title}</TableCell>
                <TableCell>{result.score}%</TableCell>
                <TableCell>{new Date(result.completion_date).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default Reports;