import "./App.css";
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import PersonalTrainer from "./components/PersonalTrainer";

function App() {
  return (
  <Container maxWidth="xl">
    <CssBaseline />
      <PersonalTrainer />
  </Container>
  );
}

export default App;
