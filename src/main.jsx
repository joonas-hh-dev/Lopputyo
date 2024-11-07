import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import CustomerPage from './pages/CustomerPage.jsx';
import TrainingPage from './pages/TrainingPage.jsx';
import CalendarPage from './pages/CalendarPage.jsx';
import StatisticsPage from './pages/StatisticsPage.jsx';

const isProduction = process.env.NODE_ENV === 'production';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter basename={isProduction ? '/Lopputyo' : ''}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<CustomerPage />} />
          <Route path="customers" element={<CustomerPage />} />
          <Route path="trainings" element={<TrainingPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="statistics" element={<StatisticsPage />} />
        </Route>
      </Routes>
    </HashRouter>
  </StrictMode>
);