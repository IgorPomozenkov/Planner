import React, { ChangeEvent, useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, CircularProgress, createTheme, ThemeProvider } from '@mui/material';
import { NoPhotography } from '@mui/icons-material';
import { getUser, avatarLoading, avatarLoaded, avatarFailure } from '@store/currentUser/selectors';
import { userSetAvatar } from '@store/currentUser/reducer';
import '@styles/profile.css'

const theme = createTheme({
  palette: {
    primary: {
      main: '#212529',
    },
  }
});

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { curUser, request } = useSelector(getUser, shallowEqual);
  const loading = useSelector(avatarLoading, shallowEqual);
  const success = useSelector(avatarLoaded, shallowEqual);
  const error = useSelector(avatarFailure, shallowEqual);

  useEffect(() => {
    if(!curUser || !curUser.id) return navigate('/');
  }, [curUser]);

  const HandleChange = (event:ChangeEvent) => {
    const formData = new FormData();
    formData.append('avatarFile', event.target.files[0]);

    dispatch(userSetAvatar(formData));
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="profilePage container">
        <div id="saveUserForm" className="userForm">
          <div className="userForm__left">
            <div className="userForm__photo">
              {(!curUser || !curUser.avatar) && !loading ?
                <NoPhotography fontSize='large' sx={{ width: '200px', height: '200px', color: '#aeb0b3' }} />
              : <img alt="Photo" src={curUser?.avatar} />
              }
              {!!loading && <CircularProgress sx={{ color: '#ffffffa8', position: 'absolute', top: '45%', left: '45%'}} />}
            </div>
            {!!success && <Alert severity="success" children="Перезагрузите страницу" sx={{ transition: '1s', animation: 'show 1s 1' }} />}
            {!!error && <Alert severity="error" children="Ошибка!" sx={{ transition: '1s', animation: 'show 1s 1' }} />}
            <div className="userForm__btn">
              <input type="file" accept="image/*" id="contained-button-file"
                style={{ display: 'none' }}
                onChange={HandleChange}
              />
              <label htmlFor="contained-button-file">
                <Button variant="contained" component="span">Изменить фото</Button>
              </label>
            </div>
          </div>
          <div className="userForm__right">
            <p className="userName">
              Имя:
              <span>{curUser?.name}</span>
            </p>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Profile;
