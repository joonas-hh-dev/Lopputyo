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
  <>
    <CssBaseline />
  
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="customers">Customers</Button>
          <Button color="inherit" component={Link} to="trainings">Trainings</Button>
          <Button color="inherit" component={Link} to="calendar">Calendar</Button>
          <Button color="inherit" component={Link} to="statistics">Statistics</Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth={false}>
        <Outlet />
      </Container>
  </>
  );
}

export default App;