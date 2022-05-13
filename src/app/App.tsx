import React from 'react';
import Router from '../Routes/Routes';
import Footer from './Footer';
import Header from './Header';
import Scene from './Scene';
import '@styles/app.css'

const App: React.FC = () => {

  return (
    <>
      <Header />
      <Scene>
        <Router />
      </Scene>
      <Footer />
    </>
  );
};

export default App;
