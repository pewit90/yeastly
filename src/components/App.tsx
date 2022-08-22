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

function App() {
  return (
    <Routes >
      <Route path='/' element={<BreadHistory breads={breads} />} />
      <Route path="/:uuid" element={<BreadView />} />
    </Routes>
  );
}

export default App;
