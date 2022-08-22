import React from 'react';
import './App.css';
import { toBread } from '../model/bread';
import bread1JSON from '../testing/input/bread1.json'
import bread2JSON from '../testing/input/bread2.json'
// import { BreadView } from './BreadView';
import { BreadHistory } from './BreadHistory';

const bread1 = toBread(bread1JSON);
const bread2 = toBread(bread2JSON);
const breads = [bread1, bread2];

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <BreadView bread={bread1}/> */}
        <BreadHistory breads={breads} />
      </header>
    </div>
  );
}

export default App;
