import React from 'react';
import './App.css';
import { toBread } from '../model/bread';
import bread1JSON from '../testing/input/bread1.json'
import bread2JSON from '../testing/input/bread2.json'
import { BreadHistory } from './BreadHistory';
import { Box } from '@mui/system';
import { BreadView } from './BreadView';
import { Link, Route, Routes } from 'react-router-dom';

const bread1 = toBread(bread1JSON);
const bread2 = toBread(bread2JSON);
const breads = [bread1, bread2];

function App() {
  return (
    <Routes >
      <Route path='/' element={<BreadHistory key='history' breads={breads} />} />
      <Route path="bugu" element={<BreadHistory key='history2' breads={[]} />} />
    </Routes>
  );
}

export default App;
