import { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Download } from '@mui/icons-material';
import axios from 'axios';

function ResultsManagement() {
  const [results, setResults] = useState([]);
  const [filters, setFilters] = useState({
    exam: '',
    student: '',
    dateFrom: '',
    dateTo: ''
  });
  const [exams, setExams] = useState([]);

  useEffect(() => {
    fetchResults();
    fetchExams();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await axios.get('http://localhost/online_exam/api/admin/exam-results.php', {
        params: filters
      });
      if (response.data.success) {
        setResults(response.data.results);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

  const fetchExams = async () => {
    try {
      const response = await axios.get('http://localhost/online_exam/api/admin/exams.php');
      if (response.data.success) {
        setExams(response.data.exams);
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };

  const handleExportResults = async () => {
    try {
      const response = await axios.get('http://localhost/online_exam/api/admin/export-results.php', {
        params: filters,
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'exam_results.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting results:', error);
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Exam Results
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Exam</InputLabel>
          <Select
            value={filters.exam}
            onChange={(e) => setFilters({ ...filters, exam: e.target.value })}
          >
            <MenuItem value="">All Exams</MenuItem>
            {exams.map((exam) => (
              <MenuItem key={exam.exam_id} value={exam.exam_id}>
                {exam.exam_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Student Name"
          value={filters.student}
          onChange={(e) => setFilters({ ...filters, student: e.target.value })}
        />

        <TextField
          type="date"
          label="From Date"
          value={filters.dateFrom}
          onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          type="date"
          label="To Date"
          value={filters.dateTo}
          onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
          InputLabelProps={{ shrink: true }}
        />

        <Button variant="contained" onClick={fetchResults}>
          Apply Filters
        </Button>

        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={handleExportResults}
        >
          Export Results
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student Name</TableCell>
              <TableCell>Exam Name</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Total Questions</TableCell>
              <TableCell>Correct Answers</TableCell>
              <TableCell>Completion Date</TableCell>
              <TableCell>Time Taken</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((result) => (
              <TableRow key={result.result_id}>
                <TableCell>{result.student_name}</TableCell>
                <TableCell>{result.exam_name}</TableCell>
                <TableCell>{result.score}%</TableCell>
                <TableCell>{result.total_questions}</TableCell>
                <TableCell>{result.correct_answers}</TableCell>
                <TableCell>{new Date(result.completion_date).toLocaleString()}</TableCell>
                <TableCell>{result.time_taken} minutes</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default ResultsManagement;