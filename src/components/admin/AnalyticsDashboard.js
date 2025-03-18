import { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Box
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import axios from 'axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    examStats: [],
    userStats: [],
    performanceStats: [],
    monthlyActivity: []
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('http://localhost/online_exam/api/admin/analytics.php');
      if (response.data.success) {
        setAnalytics(response.data.analytics);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Analytics Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Students
              </Typography>
              <Typography variant="h4">
                {analytics.userStats.totalStudents}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Exams
              </Typography>
              <Typography variant="h4">
                {analytics.examStats.totalExams}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Score
              </Typography>
              <Typography variant="h4">
                {analytics.performanceStats.averageScore}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Exams This Month
              </Typography>
              <Typography variant="h4">
                {analytics.examStats.monthlyExams}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Activity
              </Typography>
              <BarChart
                width={500}
                height={300}
                data={analytics.monthlyActivity}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="exams" fill="#8884d8" name="Exams Taken" />
                <Bar dataKey="students" fill="#82ca9d" name="Active Students" />
              </BarChart>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance Distribution
              </Typography>
              <PieChart width={400} height={300}>
                <Pie
                  data={analytics.performanceStats.distribution}
                  cx={200}
                  cy={150}
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {analytics.performanceStats.distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default AnalyticsDashboard;