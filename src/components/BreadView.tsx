import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, IconButton, Typography } from "@mui/material";
import Step_MUI from '@mui/material/Step';
import StepContent_MUI from '@mui/material/StepContent';
import StepLabel_MUI from '@mui/material/StepLabel';
import Stepper_MUI from '@mui/material/Stepper';
import { useNavigate, useParams } from "react-router-dom";
import { Bread } from '../model/bread';
import { Step } from "../model/step";
import { getBread } from "../model/store";
import { Page } from './Page';

import React from 'react';


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

export function StepList(props: { bread: Bread }) {
    // TODO is this the correct way to get notified by updates?
    const [activeStep, setActiveStep] = React.useState(props.bread.currentStepIndex);
    const steps = props.bread.steps; //todo this might also get updated

    const handleNext = (step:Step,index:number) => {
        // TODO
        const updatedStep = Step.fromObject({
            ...step,
            completed: true,
            completedAt: new Date()
        });
        steps[index] = updatedStep;
        setActiveStep(props.bread.currentStepIndex);
    }
    const handleBack = () => {
        // TODO
    }

    return <Stepper_MUI activeStep={activeStep} orientation='vertical'>
        {steps.map((step, index) => {
            return <Step_MUI key={step.name + index} completed={step.completed} >
                <StepLabel_MUI  >{step.name}</StepLabel_MUI>
                <StepContent_MUI>
                    {step.startedAt && <StepBoxItem title="Start Time" value={step.startedAt?.toLocaleTimeString() ?? ''} />}
                    <Box sx={{ mb: 2 }}>
                        <div>
                            <Button
                                variant="contained"
                                onClick={()=>handleNext(step,index)}
                                sx={{ mt: 1, mr: 1 }}
                            >
                                {index === steps.length - 1 ? 'Finish' : 'Continue'}
                            </Button>
                            <Button
                                disabled={index === 0}
                                onClick={handleBack}
                                sx={{ mt: 1, mr: 1 }}
                            >
                                Back
                            </Button>
                        </div>
                    </Box>
                </StepContent_MUI>
            </Step_MUI>
        })}
    </Stepper_MUI>


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
    const stepList = <StepList bread={bread} />;

    return <Page title={bread.name} navigationIcon={navigationIcon} >
        {stepList}
    </Page>
}