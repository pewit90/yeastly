import React from 'react';
import './App.css';
import Button from '@mui/material/Button';
import { Step, toBread } from '../model/bread';
import { Card, CardActions, CardContent, Stack, Typography } from '@mui/material';
import TestBread from '../testing/input/bread1.json'

const testBread = toBread(TestBread);

function StepBox(props: {step: Step}) {

  const card = <Card sx={{ minWidth: 275 }}>
    <CardContent>
      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        {props.step.name}
      </Typography>
      <Typography sx={{ mb: 1.5 }} color="text.secondary">
        {props.step.trigger?.startTime?.toString()}
      </Typography>
      <Typography sx={{ mb: 1.5 }} color="text.secondary">
        {props.step.trigger?.endTime?.toString()}
      </Typography>
      <Typography variant="body2">
        {props.step.completed.toString()}
      </Typography>
    </CardContent>
    <CardActions>
      <Button size="small">Complete</Button>
    </CardActions>
  </Card>
  return card;
}

function StepsList(props: { steps: Step[] }) {
  const stepBoxList = props.steps.map(el => StepBox({step: el as Step}));
  return <Stack spacing={2}>
    {stepBoxList}
  </Stack>
}


function App() {
  const steps = testBread.steps;
  return (
    <div className="App">
      <header className="App-header">
        <StepsList steps={steps} />
      </header>
    </div>
  );
}

export default App;
