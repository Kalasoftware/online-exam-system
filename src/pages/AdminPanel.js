import { useState } from 'react';
import { Container, Grid, Paper, Typography, Tabs, Tab, Box } from '@mui/material';
import UserManagement from '../components/admin/UserManagement';
import ExamManagement from '../components/admin/ExamManagement';
import Reports from '../components/admin/Reports';
import ActivityMonitor from '../components/admin/ActivityMonitor';

function AdminPanel() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const TabPanel = ({ children, value, index }) => (
    <Box sx={{ display: value !== index ? 'none' : 'block', p: 3 }}>
      {children}
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom>
              Admin Dashboard
            </Typography>
            <Tabs value={currentTab} onChange={handleTabChange}>
              <Tab label="User Management" />
              <Tab label="Exam Management" />
              <Tab label="Reports" />
              <Tab label="Activity Monitor" />
            </Tabs>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <TabPanel value={currentTab} index={0}>
            <UserManagement />
          </TabPanel>
          <TabPanel value={currentTab} index={1}>
            <ExamManagement />
          </TabPanel>
          <TabPanel value={currentTab} index={2}>
            <Reports />
          </TabPanel>
          <TabPanel value={currentTab} index={3}>
            <ActivityMonitor />
          </TabPanel>
        </Grid>
      </Grid>
    </Container>
  );
}

export default AdminPanel;