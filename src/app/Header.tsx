import React, { useEffect, useState, useRef } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Avatar, Box, createTheme, Drawer, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, ThemeProvider, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { AccountCircle, Home, HomeOutlined, ManageAccounts, ManageAccountsOutlined } from '@mui/icons-material';
import { getUser } from '@store/currentUser/selectors';
import { calendarInitDeeds } from '@/store/calendar/reducer';
import { userLogin } from '@/store/currentUser/reducer';
import Login from '@/components/login';
import CurrentUser from '@/components/currentUser';

const theme = createTheme({
  palette: {
    primary: {
      main: '#212529',
    },
    secondary: {
      main: '#2b0068',
    }
  }
});

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const ref = useRef(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawer, setDrawer] = useState(false);
  const [typography, setTypography] = useState('');
  const { authed, curUser, request } = useSelector(getUser, shallowEqual);

  const links = [
    {
      name: 'Home',
      path: '/',
      iconActive: <Home />,
      icon: <HomeOutlined />,
      disabled: false
    },
    {
      name: 'Profile',
      path: '/profile',
      iconActive: <ManageAccounts />,
      icon: <ManageAccountsOutlined />,
      disabled: !authed
    },
  ];

  useEffect(() => {
    links.forEach((link) => {
      if(location.pathname === link.path) setTypography(link.name);
    });
  }, [location.pathname]);

  useEffect(() => {
    if(!curUser || !curUser.id) {
      return;
    }else {
      dispatch(userLogin(curUser.name, curUser.password));
    }
  }, []);

  useEffect(() => {
    if(!curUser || !curUser.id) {
      ref.current = false;
      return;
    }
    if(ref.current) {
      ref.current = false;
    }else dispatch(calendarInitDeeds(curUser.id));
  }, [curUser]);

  useEffect(() => {
    if(request.status === 2) setAnchorEl(null);
  }, [request.status]);

  const handleMenu = (e:React.MouseEvent) => {
    setAnchorEl(e.currentTarget);
  }

  const handleClose = (event:React.KeyboardEvent | React.MouseEvent) => {
    const e = event as React.KeyboardEvent
    if (e.type === 'keydown' && ( e.key === 'Tab')) {
      return;
    }
    setAnchorEl(null);
  }

  const toggleDrawer = (open:boolean) => (event:React.KeyboardEvent | React.MouseEvent) => {
    const e = event as React.KeyboardEvent
    if (e.type === 'keydown' && ( !(e.key === 'Enter'))) {
      return;
    }
    setDrawer(open);
  }

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" color='primary' enableColorOnDark={true}>
        <Toolbar>
          <IconButton color="inherit" size="large" edge="start" aria-label="menu" onClick={toggleDrawer(true)} sx={{ '&:hover': {backgroundColor: '#ffffff1c'} }}>
            <MenuIcon fontSize="large" />
          </IconButton>
          <Typography className='typographyMedia' variant="h5" component="div" sx={{ ml: 3, flexGrow: 1 }}>
            {typography}
          </Typography>
          <Box>
            <IconButton color="inherit" size="large" onClick={handleMenu}  sx={{ '&:hover': {backgroundColor: '#ffffff1c'} }}>
             {authed ? <Avatar children={curUser?.name.slice(0, 1)} src={curUser?.avatar} /> : <AccountCircle fontSize="large" /> }
            </IconButton>
            <Menu className='userMenu' anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}
              transformOrigin={{ vertical: 'top', horizontal: 'right', }}
              anchorOrigin={{ vertical: 'top', horizontal: 'right', }}
              sx={{ mt: '40px' }}
            >
              {authed ? <CurrentUser /> : <Login />}
            </Menu>
          </Box>
        </Toolbar>
        <Drawer anchor={'left'} open={drawer} onClose={toggleDrawer(false)}>
          <Box role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)} sx={{ width: '220px', mt: '20px' }}>
            <MenuList>
              {links.map((link, idx) => <MenuItem key={idx} disabled={link.disabled} onClick={() => navigate(link.path)} sx={{ height: '45px' }}
              className={location.pathname === link.path ? 'drawerMenuItem' : ''}>
                <ListItemIcon sx={{ color: '#000000de', mr: "5px" }}>{location.pathname === link.path ? link.iconActive : link.icon}</ListItemIcon>
                <ListItemText>{link.name.toUpperCase()}</ListItemText>
              </MenuItem>)}
            </MenuList>
          </Box>
        </Drawer>
      </AppBar>
    </ThemeProvider>
  )
}

export default Header;
