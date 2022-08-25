import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Card, CardActions, CardContent, Container, Grid, IconButton, Paper, Stack, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { Bread } from '../model/bread';
import { Step } from "../model/step";
import { getBread } from "../model/store";
import { Page } from './Page';

/*
    Steps view
*/
function StepBoxItem(props: { title: string, value: string }) {
    return <div style={{ display: "flex" }}>
        <div style={{ textAlign: "left" }}>
            <Typography color={'text.primary'} align='left'>{props.title}</Typography>
        </div>
        <div style={{ textAlign: "right", flex: 1 }} >
            <Typography color={'text.secondary'}>{props.value}</Typography>
        </div>
    </div>
}

function StepBox(props: { step: Step, index: number, currentStepIndex: number }) {
    const step = props.step;
    const index = props.index;
    const currentStepIndex = props.currentStepIndex;
    return <Card key={step.name + index} sx={{ minWidth: 275 }}>
        <CardContent>
            <Typography gutterBottom variant="h6" component="div">
                {step.name}
            </Typography>
            {step.startedAt && <StepBoxItem title="Start Time" value={step.startedAt?.toLocaleTimeString() ?? ''} />}
            {step.completedAt && <StepBoxItem title="End Time" value={step.completedAt?.toLocaleTimeString() ?? ''} />}
            <StepBoxItem title="State" value={step.state} />
        </CardContent>
        <CardActions>
            {index === currentStepIndex && <Button size="small" variant='contained' color='primary'>Complete</Button>}
        </CardActions>
    </Card>
}

function StepBoxList(props: { steps: Step[], currentStepIndex: number }) {
    const stepBoxList = props.steps.map((el, index) => StepBox({ step: el, index: index, currentStepIndex: props.currentStepIndex }));
    return <Stack spacing={1}>
        {stepBoxList}
    </Stack>
}

/*
    Dashboard view
*/
function BreadDashboard(props: { bread: Bread }) {
    const bread = props.bread;
    return <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>

            <Grid item xs={12} md={8} lg={9}>
                {/*
                    Current Step
                */}

                <StepBox step={bread.steps[bread.currentStepIndex]} index={bread.currentStepIndex} currentStepIndex={bread.currentStepIndex} />
            </Grid>
            {/*
            Projected end time
            */}
            <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    <Card >
                        <CardContent>
                            <Typography gutterBottom variant="h6" component="div">
                                {/* {""+bread.steps.reduce((previous, current)=> {previous+current.duration??0})} */}
                            </Typography>
                        </CardContent>
                    </Card>
                </Paper>
            </Grid>

        </Grid>
    </Container>
}

/*
    Tabs
*/
export function BreadView() {
    const params = useParams();
    const uuid = Number(params.uuid!);
    const bread = getBread(uuid);
    const navigate = useNavigate();

    const navigationIcon = <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="back"
        sx={{ mr: 2 }}
        onClick={() => navigate('/')}
    >
        <ArrowBackIcon />
    </IconButton>;
    const stepBoxList = <StepBoxList steps={bread.steps} currentStepIndex={bread.currentStepIndex} />;

    return <Page title={bread.name} navigationIcon={navigationIcon} >
        {stepBoxList}
        {/* <BreadDashboard bread={bread} /> */}
    </Page>
}