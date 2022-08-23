import { createTheme, ThemeProvider } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import { toBread } from '../model/bread';
import bread1JSON from '../testing/input/bread1.json';
import bread2JSON from '../testing/input/bread2.json';
import './App.css';
import { BreadHistory } from './BreadHistory';
import { BreadView } from './BreadView';

const bread1 = toBread(bread1JSON);
const bread2 = toBread(bread2JSON);
const breads = [bread1, bread2];

export const theme = createTheme({
  palette: {
    primary: {
      main: '#8d6e63',
    },
    secondary: {
      main: '#ff6f00',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Routes >
        <Route path='/' element={<BreadHistory breads={breads} />} />
        <Route path="/:uuid" element={<BreadView />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
