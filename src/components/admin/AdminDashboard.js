import { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  Assignment,
  Settings,
  Assessment
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function AdminDashboard({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <Dashboard />,
      path: '/admin'
    },
    {
      text: 'User Management',
      icon: <People />,
      path: '/admin/users'
    },
    {
      text: 'Exam Management',
      icon: <Assignment />,
      path: '/admin/exams'
    },
    {
      text: 'Results',
      icon: <Assessment />,
      path: '/admin/results'
    },
    {
      text: 'System Settings',
      icon: <Settings />,
      path: '/admin/settings'
    }
  ];

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap>
          Admin Panel
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Online Examination System
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawer}
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default AdminDashboard;