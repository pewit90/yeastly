import React from 'react';
import './App.css';
import Button from '@mui/material/Button';
import { Step, toBread } from '../model/bread';
import { AppBar, Card, CardActions, CardContent, IconButton, Paper, Stack, Toolbar, Typography } from '@mui/material';
import { Box, Container } from '@mui/system';
import MenuIcon from '@mui/icons-material/Menu';
import TestBread from '../testing/input/bread1.json'


const testBread = toBread(TestBread);

function StepBoxItem(props: { title: string, value: string }) {
  return <Typography color='text.secondary' >
    <div style={{ display: "flex" }}>
      <div style={{ textAlign: "left" }}>{props.title}</div>
      <div style={{ textAlign: "right", flex: 1 }} >{props.value}</div>
    </div>
  </Typography>
}

function StepBox(props: { step: Step }) {
  return <Card sx={{ minWidth: 275 }}>
    <CardContent>
      <Typography gutterBottom variant="h5" component="div">
        {props.step.name}
      </Typography>
      <StepBoxItem title={'Start Time'} value={props.step.trigger?.startTime?.toLocaleTimeString() ?? ''} />
      <StepBoxItem title={'End Time'} value={props.step.trigger?.endTime?.toLocaleTimeString() ?? ''} />
      <StepBoxItem title={'Completed'} value={props.step.completed.toString()} />
    </CardContent>
    <CardActions>
      <Button hidden={props.step.completed} size="small">Complete</Button>
    </CardActions>
  </Card>
}

function StepsList(props: { steps: Step[] }) {
  const stepBoxList = props.steps.map(el => StepBox({ step: el as Step }));
  return <Stack spacing={2}>
    {stepBoxList}
  </Stack>
}

function App() {
  const steps = testBread.steps;
  return (
    <div className="App">
      <header className="App-header">
        <Container maxWidth={'sm'}>
          <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
              <Toolbar>
                <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                  onClick={()=> alert('not implemented')}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" align='left' sx={{ flexGrow: 1 }}>
                  {testBread.name}
                </Typography>
              </Toolbar>
            </AppBar>
          </Box>
          <Paper elevation={3}>
            <Container maxWidth={'xs'}>
              <StepsList steps={steps} />
            </Container>
          </Paper>
        </Container>
      </header>
    </div>
  );
}

export default App;
