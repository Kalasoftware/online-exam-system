import { Box, Button, Container, Typography, Paper, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Header */}
      <Paper elevation={0} sx={{ bgcolor: 'primary.main', color: 'white', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom>
            Online Examination System
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Excellence Through Digital Assessment
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large"
            onClick={() => navigate('/login')}
            sx={{ mt: 2 }}
          >
            Get Started
          </Button>
        </Container>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ my: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" gutterBottom>
                For Students
              </Typography>
              <Typography>
                • Easy-to-use exam interface<br />
                • Instant results and feedback<br />
                • Track your progress<br />
                • Practice tests available
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" gutterBottom>
                For Teachers
              </Typography>
              <Typography>
                • Create custom exams<br />
                • Automated grading<br />
                • Detailed analytics<br />
                • Student performance tracking
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" gutterBottom>
                Institution Benefits
              </Typography>
              <Typography>
                • Paperless examination<br />
                • Secure testing environment<br />
                • Comprehensive reporting<br />
                • Cost-effective solution
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* About Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" gutterBottom align="center">
            About Our Institution
          </Typography>
          <Typography variant="body1" paragraph align="center">
            We are committed to providing quality education through innovative digital solutions.
            Our online examination system is designed to make assessment fair, efficient, and accessible to all.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
            <Button variant="contained" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button variant="outlined" onClick={() => navigate('/register')}>
              Register
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default LandingPage;