import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import "./assets/css/general.css";
import "./assets/css/index.css";
import "./assets/css/pages-icons.css";
import "./assets/css/pages-sidebar.css";

import Homepage from './components/home';
import { Toaster } from 'react-hot-toast';
import { PatientProvider } from './contexts';
import PageLayout from './components/layouts/PageLayout';
import notification from './utility/notification';

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Function to check and set the timeout
    const checkAndSetTimeout = () => {
      const loginTime = localStorage.getItem('LOGIN_TIME');
      if (loginTime) {
        const currentTime = new Date().getTime();
        const timeElapsed = currentTime - loginTime;
        const timeRemaining = 3600000 - timeElapsed;

        if (timeRemaining > 0) {
          const timeoutId = setTimeout(() => {
            navigate('/');
            notification({
              title: 'ACCESS DENIED',
              message: 'Sorry, Session has expired. Please try again',
              type: 'warning',
            });
            localStorage.removeItem('LOGIN_TIME'); // Clear the login time on timeout
          }, timeRemaining);

          // Clear the timeout if the component unmounts
          return () => clearTimeout(timeoutId);
        } else {
          // If the time has already expired, navigate immediately
          navigate('/');
          notification({
            title: 'ACCESS DENIED',
            message: 'Sorry, Session has expired. Please try again',
            type: 'warning',
          });
          localStorage.removeItem('LOGIN_TIME'); // Clear the login time
        }
      }
    };

    checkAndSetTimeout();
  }, [navigate]);

  return (
    <PatientProvider>
      <div>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="*" element={<PageLayout />} />
        </Routes>
        <Toaster />
      </div>
    </PatientProvider>
  );
};

const RootApp = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default RootApp;
