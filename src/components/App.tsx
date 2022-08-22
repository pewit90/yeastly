import React from 'react';
import './App.css';
import { toBread } from '../model/bread';
import bread1JSON from '../testing/input/bread1.json'
import bread2JSON from '../testing/input/bread2.json'
import { BreadHistory } from './BreadHistory';
import { Box } from '@mui/system';
import { BreadView } from './BreadView';

const bread1 = toBread(bread1JSON);
const bread2 = toBread(bread2JSON);
const breads = [bread1, bread2];

function App() {
  return (
    <div className="App">
        <Box sx={{ height: '100%' }}>
          <BreadHistory breads={breads} />
          {/* <BreadView bread={bread1}/> */}
        </Box>
    </div>
  );
}

export default App;
