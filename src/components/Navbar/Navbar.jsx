import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Message as MessageIcon,
  Favorite as FavoriteIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          Marketplace Tunisia
        </Typography>

        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              color="inherit"
              startIcon={<SearchIcon />}
              onClick={() => navigate('/search')}
            >
              Search
            </Button>
            {user ? (
              <>
                <Button
                  color="inherit"
                  startIcon={<MessageIcon />}
                  onClick={() => navigate('/messages')}
                >
                  Messages
                </Button>
                <Button
                  color="inherit"
                  startIcon={<FavoriteIcon />}
                  onClick={() => navigate('/favorites')}
                >
                  Favorites
                </Button>
                <Button
                  color="inherit"
                  startIcon={<NotificationsIcon />}
                  onClick={() => navigate('/notifications')}
                >
                  Notifications
                </Button>
              </>
            ) : null}
          </Box>
        )}

        {user ? (
          <>
            <IconButton
              color="inherit"
              onClick={handleMenu}
              sx={{ ml: 2 }}
            >
              <Avatar
                src={user.avatar?.startsWith('http') ? user.avatar :
                     `http://${window.location.hostname}:5002${user.avatar}` || '/default-avatar.png'}
                sx={{ width: 32, height: 32 }}
              />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
                Profile
              </MenuItem>
              <MenuItem onClick={() => { navigate('/settings'); handleClose(); }}>
                Settings
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              color="inherit"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button
              color="inherit"
              variant="outlined"
              onClick={() => navigate('/register')}
            >
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;