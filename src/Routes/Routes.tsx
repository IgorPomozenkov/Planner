import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

const Home = React.lazy(() => import(/* webpackChunkName: "login" */ '@scenes/HomePage/Home'));
const Profile = React.lazy(() => import('@/scenes/ProfilePage/Profile'));

const Router: React.FC = () => {
  return (
    <Suspense
      fallback={
        <CircularProgress
          color="primary"
          sx={{
            position: 'absolute',
            top: '10%',
            left: '45%',
            color: '#212529'
          }}
        />
      }
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<h2 style={{ display: 'flex', justifyContent: 'center' }}>404: Page not found</h2>} />
      </Routes>
    </Suspense>
  );
};

export default Router;
