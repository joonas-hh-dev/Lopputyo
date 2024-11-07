import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import CustomerPage from './pages/CustomerPage.jsx';
import TrainingPage from './pages/TrainingPage.jsx';
import CalendarPage from './pages/CalendarPage.jsx';
import StatisticsPage from './pages/StatisticsPage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="Lopputyo/customers" element={<CustomerPage />} />
          <Route path="Lopputyo/trainings" element={<TrainingPage />} />
          <Route path="Lopputyo/calendar" element={<CalendarPage />} />
          <Route path="Lopputyo/statistics" element={<StatisticsPage />} />
        </Route>
      </Routes>
    </HashRouter>
  </StrictMode>
);