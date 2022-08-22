import { AppBar, Box, Button, Card, CardActions, CardContent, Container, IconButton, Paper, Stack, Toolbar, Typography } from "@mui/material";
import { Step } from "../model/bread";
import MenuIcon from '@mui/icons-material/Menu';
import { useParams } from "react-router-dom";
import { getBread } from "../model/store";

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
            { props.step.completed || <Button size="small">Complete</Button> }
        </CardActions>
    </Card>
}

function StepsList(props: { steps: Step[] }) {
    const stepBoxList = props.steps.map(el => StepBox({ step: el as Step }));
    return <Stack spacing={2}>
        {stepBoxList}
    </Stack>
}

export function BreadView() {
    const params = useParams();
    const uuid = Number(params.uuid!);
    const bread = getBread(uuid);

    return <Container maxWidth={'sm'}>
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={() => alert('not implemented')}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" component="div" align='left' sx={{ flexGrow: 1 }}>
                        {bread.name}
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
        <Paper elevation={3}>
            <Container maxWidth={'xs'}>
                <StepsList steps={bread.steps} />
            </Container>
        </Paper>
    </Container>
}