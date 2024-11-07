import React from "react";
import "./App.css";
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { Outlet } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

function App() {
  return (
    <Container maxWidth="xl">
      <CssBaseline />
      
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="Lopputyo/customers">Customers</Button>
          <Button color="inherit" component={Link} to="Lopputyo/trainings">Trainings</Button>
          <Button color="inherit" component={Link} to="Lopputyo/calendar">Calendar</Button>
          <Button color="inherit" component={Link} to="Lopputyo/statistics">Statistics</Button>
        </Toolbar>
      </AppBar>

      <Outlet />
    </Container>
  );
}

export default App;