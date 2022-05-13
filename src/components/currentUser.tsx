import React, { useEffect } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { getUser } from '@store/currentUser/selectors';
import { Avatar, Box, Divider, ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { ExitToApp, NoPhotography, SettingsOutlined } from '@mui/icons-material';
import { userLogout } from '@/store/currentUser/reducer';
import { calendarClearDeeds } from '@/store/calendar/reducer';

const CurrentUser: React.FC = React.memo(() => {
  const dispatch = useDispatch();
  const { curUser } = useSelector(getUser, shallowEqual);

  const handlLogout = () => {
    dispatch(userLogout());
    dispatch(calendarClearDeeds());
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '170px' , p: '0 16px 20px 16px' }}>
        <Avatar children={<NoPhotography fontSize='large' />} src={curUser?.avatar} sx={{ width:'80px', height:'80px' }} />
        <ListItemText primary={curUser?.name} secondary={'basic'} sx={{ ml: '15px' }} primaryTypographyProps={{ fontWeight: '600' }} />
      </Box>
      {/*
      <MenuItem>
        <ListItemIcon><SettingsOutlined fontSize="small" /></ListItemIcon>
        Настройки
      </MenuItem>
      */}
      <Divider />
      <MenuItem onClick={handlLogout}>
        <ListItemIcon><ExitToApp fontSize="small" /></ListItemIcon>
        Выйти
      </MenuItem>
    </>
  );
});

export default CurrentUser;
