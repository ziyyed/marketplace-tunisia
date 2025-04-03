import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Browse', path: '/search' },
    ...(user ? [{ label: 'Dashboard', path: '/dashboard' }] : []),
  ];

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Marketplace Tunisia
        </Typography>

        {isMobile ? (
          <>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMobileMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={mobileMenuAnchor}
              open={Boolean(mobileMenuAnchor)}
              onClose={handleMobileMenuClose}
            >
              {menuItems.map((item) => (
                <MenuItem
                  key={item.label}
                  onClick={() => {
                    navigate(item.path);
                    handleMobileMenuClose();
                  }}
                >
                  {item.label}
                </MenuItem>
              ))}
              {user ? (
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              ) : (
                <>
                  <MenuItem
                    onClick={() => {
                      navigate('/login');
                      handleMobileMenuClose();
                    }}
                  >
                    Login
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      navigate('/register');
                      handleMobileMenuClose();
                    }}
                  >
                    Register
                  </MenuItem>
                </>
              )}
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {menuItems.map((item) => (
              <Button
                key={item.label}
                color="inherit"
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </Button>
            ))}
            {user ? (
              <>
                <Avatar
                  src={user.avatar}
                  alt={user.name}
                  sx={{ width: 32, height: 32 }}
                />
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button color="inherit" onClick={() => navigate('/register')}>
                  Register
                </Button>
              </>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
} 