import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { userLogin, userRegister } from '@store/currentUser/reducer';
import { Button, CircularProgress, Divider, TextField } from '@mui/material';
import { userLoading, userFailure } from '@/store/currentUser/selectors';

const Login: React.FC = React.memo(() => {
  const dispatch = useDispatch();
  const loading = useSelector(userLoading, shallowEqual);
  const userError = useSelector(userFailure, shallowEqual);
  const [name, setName] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);


  useEffect(() => {
    if(!!userError) setError(true);
  }, [userError]);

  function handleChangeName(e: ChangeEvent) {
    if(e.target.value.length <= 30) setName(e.target.value);
    setError(false);
  }

  function handleChangePass(e: ChangeEvent) {
    if(e.target.value.length <= 15) setPass(e.target.value);
    setError(false);
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const btnId = e.nativeEvent.submitter.id;
    if(name && pass) {
      if(btnId === '1') dispatch(userLogin(name, pass));
      if(btnId === '2') dispatch(userRegister(name, pass));
    }
    setName('');
    setPass('');
  }

  return (
    <>
      <form id="userForm" onSubmit={handleSubmit} style={{ display:'flex', flexDirection: 'column', padding: '10px' }}>
        <TextField type="text" label="Login" required autoFocus margin="dense" disabled={loading} error={error} value={name} onChange={handleChangeName} />
        <TextField type="password" label="Password" required margin="dense" disabled={loading} error={error} value={pass} onChange={handleChangePass} />
      </form>
      <Divider />
      { loading ?
        <CircularProgress sx={{ position: 'absolute', top: '40%', left: '40%'}} />
      : <div style={{display:'flex', justifyContent: 'space-between', padding: '15px 10px' }}>
          <Button variant="contained" id="1" type="submit" form="userForm">Login</Button>
          <Button variant="contained" id="2" color="secondary" type="submit" form="userForm" >Register</Button>
        </div>
      }
    </>
  );
});

export default Login;
