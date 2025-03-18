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
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Pagination
} from '@mui/material';
import axios from 'axios';

function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({
    user: '',
    action: '',
    dateFrom: '',
    dateTo: ''
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLogs();
  }, [page]);

  const fetchLogs = async () => {
    try {
      const response = await axios.get('http://localhost/online_exam/api/admin/activity-logs.php', {
        params: {
          ...filters,
          page: page,
          limit: 10
        }
      });
      if (response.data.success) {
        setLogs(response.data.logs);
        setTotalPages(Math.ceil(response.data.total / 10));
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const handleFilter = () => {
    setPage(1);
    fetchLogs();
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        User Activity Logs
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          label="User"
          value={filters.user}
          onChange={(e) => setFilters({ ...filters, user: e.target.value })}
        />

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Action Type</InputLabel>
          <Select
            value={filters.action}
            onChange={(e) => setFilters({ ...filters, action: e.target.value })}
          >
            <MenuItem value="">All Actions</MenuItem>
            <MenuItem value="login">Login</MenuItem>
            <MenuItem value="exam_start">Exam Start</MenuItem>
            <MenuItem value="exam_submit">Exam Submit</MenuItem>
            <MenuItem value="exam_create">Exam Create</MenuItem>
            <MenuItem value="user_create">User Create</MenuItem>
          </Select>
        </FormControl>

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

        <Button variant="contained" onClick={handleFilter}>
          Apply Filters
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>IP Address</TableCell>
              <TableCell>Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.log_id}>
                <TableCell>{log.user_name}</TableCell>
                <TableCell>{log.action_type}</TableCell>
                <TableCell>{log.details}</TableCell>
                <TableCell>{log.ip_address}</TableCell>
                <TableCell>{new Date(log.created_at).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Paper>
  );
}

export default ActivityLogs;