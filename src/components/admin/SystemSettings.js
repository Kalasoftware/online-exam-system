import { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Snackbar,
  Alert,
  Card,
  CardContent
} from '@mui/material';
import axios from 'axios';

function SystemSettings() {
  const [settings, setSettings] = useState({
    site_name: '',
    admin_email: '',
    allow_registration: true,
    maintenance_mode: false,
    session_timeout: 30,
    max_login_attempts: 3,
    password_policy: {
      min_length: 8,
      require_special: true,
      require_numbers: true,
      require_uppercase: true
    }
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('http://localhost/online_exam/api/admin/settings.php');
      if (response.data.success) {
        setSettings(response.data.settings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.post('http://localhost/online_exam/api/admin/update-settings.php', settings);
      if (response.data.success) {
        setSnackbar({
          open: true,
          message: 'Settings saved successfully',
          severity: 'success'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to save settings',
        severity: 'error'
      });
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        System Settings
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                General Settings
              </Typography>
              <TextField
                fullWidth
                label="Site Name"
                value={settings.site_name}
                onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Admin Email"
                value={settings.admin_email}
                onChange={(e) => setSettings({ ...settings, admin_email: e.target.value })}
                margin="normal"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.allow_registration}
                    onChange={(e) => setSettings({ ...settings, allow_registration: e.target.checked })}
                  />
                }
                label="Allow User Registration"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.maintenance_mode}
                    onChange={(e) => setSettings({ ...settings, maintenance_mode: e.target.checked })}
                  />
                }
                label="Maintenance Mode"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Security Settings
              </Typography>
              <TextField
                fullWidth
                type="number"
                label="Session Timeout (minutes)"
                value={settings.session_timeout}
                onChange={(e) => setSettings({ ...settings, session_timeout: parseInt(e.target.value) })}
                margin="normal"
              />
              <TextField
                fullWidth
                type="number"
                label="Max Login Attempts"
                value={settings.max_login_attempts}
                onChange={(e) => setSettings({ ...settings, max_login_attempts: parseInt(e.target.value) })}
                margin="normal"
              />
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Password Policy
              </Typography>
              <TextField
                fullWidth
                type="number"
                label="Minimum Password Length"
                value={settings.password_policy.min_length}
                onChange={(e) => setSettings({
                  ...settings,
                  password_policy: {
                    ...settings.password_policy,
                    min_length: parseInt(e.target.value)
                  }
                })}
                margin="normal"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.password_policy.require_special}
                    onChange={(e) => setSettings({
                      ...settings,
                      password_policy: {
                        ...settings.password_policy,
                        require_special: e.target.checked
                      }
                    })}
                  />
                }
                label="Require Special Characters"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.password_policy.require_numbers}
                    onChange={(e) => setSettings({
                      ...settings,
                      password_policy: {
                        ...settings.password_policy,
                        require_numbers: e.target.checked
                      }
                    })}
                  />
                }
                label="Require Numbers"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.password_policy.require_uppercase}
                    onChange={(e) => setSettings({
                      ...settings,
                      password_policy: {
                        ...settings.password_policy,
                        require_uppercase: e.target.checked
                      }
                    })}
                  />
                }
                label="Require Uppercase Letters"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Button
        variant="contained"
        onClick={handleSave}
        sx={{ mt: 3 }}
      >
        Save Settings
      </Button>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default SystemSettings;