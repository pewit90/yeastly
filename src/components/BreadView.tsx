import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { addMinutes, intervalToDuration } from "date-fns";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Bread } from "../model/bread";
import { Step, StepState } from "../model/step";
import { getBread, storeBread } from "../model/store";
import { Page } from "./Page";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import Fab from "@mui/material/Fab";
export interface StepViewProps {
  step: Step;
  isCurrent?: boolean;
  onStart: () => void;
}

function remainingDuration(step: Step): Duration | null {
  if (step.duration === undefined) {
    return null;
  } else if (step.startedAt === undefined) {
    return { minutes: step.duration };
  } else {
    const endTime = addMinutes(step.startedAt, step.duration);
    return intervalToDuration({
      start: new Date(),
      end: endTime,
    });
  }
}

function formatDuration(duration: Duration | null): string | null {
  if (!duration) {
    return null;
  }

  if (Math.abs((duration.months ?? 0) + (duration.years ?? 0)) > 0) {
    return "long";
  }

  if (Math.abs(duration.days ?? 0) > 0) {
    return `${duration.days ?? 0}d ${duration.hours ?? 0}h`;
  }

  if (Math.abs(duration.hours ?? 0) > 0) {
    return `${duration.hours ?? 0}h ${duration.minutes ?? 0}m`;
  }

  const formatZero = (n: number) => (n < 10 ? "0" + n : "" + n);
  return `${duration.minutes ?? 0}m ${formatZero(duration.seconds ?? 0)}s`;
}

function StepView({ step, isCurrent, onStart }: StepViewProps) {
  return (
    <Box sx={{ display: "flex", gap: "0.4rem", width: "100%" }}>
      <Box
        sx={{
          mt: "0.45rem",
          width: "5rem",
          fontWeight: "bold",
          textAlign: "right",
        }}
      >
        <Box>
          {isCurrent && (
            <RefreshContainer
              content={() => (
                <Box>{formatDuration(remainingDuration(step))}</Box>
              )}
            />
          )}
        </Box>
      </Box>
      <Box
        sx={{
          flex: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <StepStateIcon state={step.state} />
        <Box
          component="span"
          sx={{ flex: "1", width: "1px", backgroundColor: "text.secondary" }}
        ></Box>
      </Box>
      <Box sx={{ flex: 1, paddingBottom: "0.2rem" }}>
        <Typography
          variant="h6"
          sx={{ lineHeight: 1, mt: "0.5rem", mb: "0.5rem" }}
        >
          {step.name}
        </Typography>
        {isCurrent && (
          <Typography>Bake in Oven with 160 deg bla bla</Typography>
        )}
        <Box display="flex" mt="1rem" mb="2rem" justifyContent="start">
          {isCurrent && step.state === StepState.PENDING && (
            <Button variant="contained" onClick={onStart}>
              Start
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}

function RefreshContainer(props: { content: () => JSX.Element }) {
  const [n, setN] = useState(true);
  useEffect(() => {
    setInterval(() => setN((old) => !old), 1000);
  }, []);
  return <>{props.content()}</>;
}

function StepStateIcon({ state }: { state: StepState }) {
  if (state === StepState.COMPLETED) {
    return <CheckCircleIcon fontSize="large" color="primary" />;
  } else if (state === StepState.PENDING) {
    return <RadioButtonUncheckedIcon fontSize="large" color="primary" />;
  } else {
    return <CircleNotificationsIcon fontSize="large" color="secondary" />;
  }
}

export function BreadView() {
  const params = useParams();
  const uuid = Number(params.uuid!);
  const [bread, setBread] = useState(() => getBread(uuid));
  const navigate = useNavigate();

  const navigationIcon = (
    <IconButton
      size="large"
      edge="start"
      color="inherit"
      aria-label="back"
      sx={{ mr: 2 }}
      onClick={() => navigate("/")}
    >
      <ArrowBackIcon />
    </IconButton>
  );
  const editIcon = (
    <Fab
      color="secondary"
      aria-label="edit"
      onClick={() => {
        navigate("/edit/" + uuid);
      }}
    >
      <ModeEditIcon />
    </Fab>
  );

  const updateBread = (mutate: (bread: Bread) => Bread) => {
    const nextBread = mutate(bread);
    storeBread(nextBread);
    setBread(nextBread);
  };

  const handleContinue = () => {
    updateBread((bread) => bread.continue());
  };
  const handleBack = () => {
    updateBread((bread) => bread.back());
  };
  const handleStartStep = () => {
    updateBread((bread) => bread.startStep());
  };
  return (
    <Page
      title={bread.name}
      navigationIcon={navigationIcon}
      fabButton={editIcon}
    >
      <Box mt="5px">
        {bread.steps.map((step: Step, index) => (
          <StepView
            step={step}
            key={`step_${index}`}
            isCurrent={bread.currentStepIndex === index}
            onStart={handleStartStep}
          />
        ))}
      </Box>
    </Page>
  );
}
