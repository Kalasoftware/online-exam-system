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
  Chip,
  Box
} from '@mui/material';
import axios from 'axios';

function ActivityMonitor() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchActivities();
    const interval = setInterval(fetchActivities, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await axios.get('http://localhost/online_exam/api/admin/activities.php');
      if (response.data.success) {
        setActivities(response.data.activities);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const getStatusChip = (status) => {
    const colors = {
      active: 'success',
      completed: 'default',
      pending: 'warning',
      suspicious: 'error'
    };

    return (
      <Chip 
        label={status.charAt(0).toUpperCase() + status.slice(1)} 
        color={colors[status]} 
        size="small" 
      />
    );
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">
          Activity Monitor
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Auto-refreshes every 30 seconds
        </Typography>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Exam</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>IP Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activities.map((activity) => (
              <TableRow key={activity.activity_id}>
                <TableCell>{activity.student_name}</TableCell>
                <TableCell>{activity.exam_title}</TableCell>
                <TableCell>{getStatusChip(activity.status)}</TableCell>
                <TableCell>{new Date(activity.start_time).toLocaleString()}</TableCell>
                <TableCell>{activity.duration} mins</TableCell>
                <TableCell>{activity.ip_address}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default ActivityMonitor;