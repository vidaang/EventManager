import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MantineProvider, createTheme } from '@mantine/core';

import './styles/App.css';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import AdminDashboardPage from './pages/Admin/AdminDashboardPage';
import AdminSettingsPage from './pages/Admin/AdminSettingsPage';

const theme = createTheme({
  /** Put your mantine theme override here */
});

function App() {
  return (
    <MantineProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/Login" element={<LoginPage />} />
          <Route path="/SignUp" element={<SignUpPage />} />
          <Route path="/AdminDashboard" element={<AdminDashboardPage />} />
          <Route path="/AdminSettings" element={<AdminSettingsPage />} />

        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
