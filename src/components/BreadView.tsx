import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Card, CardActions, CardContent, IconButton, Stack, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { Step } from "../model/step";
import { getBread } from "../model/store";
import { Page } from './Page';

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

function StepBox(props: { step: Step }) {
    return <Card sx={{ minWidth: 275 }}>
        <CardContent>
            <Typography gutterBottom variant="h6" component="div">
                {props.step.name}
            </Typography>
            <StepBoxItem title="Start Time" value={props.step.startedAt?.toLocaleTimeString() ?? ''} />
            <StepBoxItem title="End Time" value={props.step.completedAt?.toLocaleTimeString() ?? ''} />
            <StepBoxItem title="State" value={props.step.state} />
        </CardContent>
        <CardActions>
            {props.step.completed || <Button size="small">Complete</Button>}
        </CardActions>
    </Card>
}

function StepBoxList(props: { steps: Step[] }) {
    const stepBoxList = props.steps.map(el => StepBox({ step: el as Step }));
    return <Stack spacing={1}>
        {stepBoxList}
    </Stack>
}

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
    const stepBoxList = <StepBoxList steps={bread.steps} />;

    return <Page title={bread.name} navigationIcon={navigationIcon} >
        {stepBoxList}
    </Page>
}