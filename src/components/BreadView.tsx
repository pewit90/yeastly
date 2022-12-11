import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CircleIcon from "@mui/icons-material/Circle";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import Fab from "@mui/material/Fab";
import { addMinutes, intervalToDuration } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Bread } from "../model/bread";
import { Step, StepState } from "../model/step";
import { getBread, storeBread } from "../model/store";
import { Page } from "./Page";

export interface StepViewProps {
  step: Step;
  isCurrent: boolean;
  isFirst: boolean;
  isLast: boolean;
  onStart: () => void;
  onContinue: () => void;
  onReset: () => void;
  onResumePrevious: () => void;
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

function stepDuration(step: Step): Duration | null {
  if (!step.startedAt || !step.completedAt) {
    return null;
  }
  return intervalToDuration({
    start: step.startedAt,
    end: step.completedAt,
  });
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

function StepView({
  step,
  isCurrent,
  isFirst,
  isLast,
  onStart,
  onContinue,
  onReset,
  onResumePrevious,
}: StepViewProps) {
  if (isCurrent) {
    return (
      <CurrentStep
        step={step}
        isLast={isLast}
        isFirst={isFirst}
        onStart={onStart}
        onContinue={onContinue}
        onReset={onReset}
        onResumePrevious={onResumePrevious}
      />
    );
  } else if (step.state === StepState.COMPLETED) {
    return <CompletedStep step={step} isLast={isLast} />;
  } else {
    return <PendingStep step={step} isLast={isLast} />;
  }
}

function CompletedStep(props: { step: Step; isLast: Boolean }) {
  return (
    <Box sx={{ display: "flex", gap: "0.4rem", width: "100%" }}>
      <Box
        sx={{
          mt: "0.45rem",
          width: "5rem",
          fontWeight: "bold",
          textAlign: "right",
        }}
      ></Box>
      <Box
        sx={{
          flex: 0,
          minWidth: "3rem",
          minHeight: "4rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <CheckCircleIcon color="primary" fontSize="large" />
        {!props.isLast && (
          <Box
            component="span"
            sx={{ flex: "1", width: "1px", backgroundColor: "text.secondary" }}
          ></Box>
        )}
      </Box>
      <Box sx={{ flex: 1, paddingBottom: "0.2rem" }}>
        <Typography
          variant="h6"
          sx={{
            lineHeight: 1,
            mt: "0.5rem",
            mb: "0.5rem",
          }}
        >
          {props.step.name}
        </Typography>
        <Box sx={{ color: "gray" }}>
          {formatDuration(stepDuration(props.step))}
        </Box>
      </Box>
    </Box>
  );
}

function PendingStep(props: { step: Step; isLast: Boolean }) {
  return (
    <Box sx={{ display: "flex", gap: "0.4rem", width: "100%" }}>
      <Box
        sx={{
          mt: "0.45rem",
          width: "5rem",
          fontWeight: "bold",
          textAlign: "right",
        }}
      ></Box>
      <Box
        sx={{
          flex: 0,
          minWidth: "3rem",
          minHeight: "4rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <RadioButtonUncheckedIcon color="primary" fontSize="large" />
        {!props.isLast && (
          <Box
            component="span"
            sx={{ flex: "1", width: "1px", backgroundColor: "text.secondary" }}
          ></Box>
        )}
      </Box>
      <Box sx={{ flex: 1, paddingBottom: "0.2rem" }}>
        <Typography
          variant="h6"
          sx={{
            lineHeight: 1,
            mt: "0.5rem",
            mb: "0.5rem",
          }}
        >
          {props.step.name}
        </Typography>
      </Box>
    </Box>
  );
}

function CurrentStep(props: {
  step: Step;
  isFirst: Boolean;
  isLast: Boolean;
  onStart: () => void;
  onContinue: () => void;
  onReset: () => void;
  onResumePrevious: () => void;
}) {
  return (
    <Box sx={{ display: "flex", gap: "0.4rem", width: "100%" }}>
      <Box
        sx={{
          mt: "0.5rem",
          width: "5rem",
          fontWeight: "bold",
          textAlign: "right",
        }}
      >
        <Box>
          <RefreshContainer
            content={() => (
              <Box>{formatDuration(remainingDuration(props.step))}</Box>
            )}
          />
        </Box>
      </Box>
      <Box
        sx={{
          flex: 0,
          minWidth: "3rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <StepMenu
          onReset={
            props.step.state === StepState.STARTED ? props.onReset : undefined
          }
          onResumePrevious={!props.isFirst ? props.onResumePrevious : undefined}
        />
        {!props.isLast && (
          <Box
            component="span"
            sx={{ flex: "1", width: "1px", backgroundColor: "text.secondary" }}
          ></Box>
        )}
      </Box>
      <Box sx={{ flex: 1, paddingBottom: "0.2rem" }}>
        <Typography
          variant="h6"
          sx={{
            lineHeight: 1,
            mt: "0.7rem",
            mb: "0.5rem",
          }}
        >
          {props.step.name}
        </Typography>
        {props.step.description && (
          <Typography>{props.step.description}</Typography>
        )}
        <Box
          display="flex"
          mt="1rem"
          mb="2rem"
          justifyContent="end"
          gap="0.5rem"
        >
          <StepControls
            state={props.step.state}
            onStart={props.onStart}
            onContinue={props.onContinue}
          />
        </Box>
      </Box>
    </Box>
  );
}

function StepControls(props: {
  state: StepState;
  onStart: () => void;
  onContinue: () => void;
}) {
  if (props.state === StepState.PENDING) {
    return (
      <Button variant="contained" onClick={props.onStart}>
        Start
      </Button>
    );
  } else if (props.state === StepState.STARTED) {
    return (
      <Button variant="contained" onClick={props.onContinue}>
        Complete
      </Button>
    );
  } else {
    return null;
  }
}

function StepMenu(props: {
  onReset?: () => void;
  onResumePrevious?: () => void;
}) {
  const iconRef = useRef(null);
  const [open, setOpen] = useState(false);
  const handleClose = (fnc: () => void) => () => {
    setOpen(false);
    fnc();
  };
  return (
    <>
      <span ref={iconRef} onClick={() => setOpen(true)}>
        <Fab size="small" color="secondary" sx={{ color: "#fafafa" }}>
          <MoreVertIcon />
        </Fab>
      </span>
      <Menu
        id="basic-menu"
        anchorEl={iconRef.current}
        open={open}
        onClose={() => setOpen(false)}
      >
        {props.onReset && (
          <MenuItem onClick={handleClose(props.onReset)}>Reset</MenuItem>
        )}
        {props.onResumePrevious && (
          <MenuItem onClick={handleClose(props.onResumePrevious)}>
            Resume Previous
          </MenuItem>
        )}
      </Menu>
    </>
  );
}

function RefreshContainer(props: { content: () => JSX.Element }) {
  const [n, setN] = useState(true);
  useEffect(() => {
    setInterval(() => setN((old) => !old), 1000);
  }, []);
  return <>{props.content()}</>;
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
  const handleReset = () => {
    updateBread((bread) => bread.reset());
  };
  const handleResumePrevious = () => {
    updateBread((bread) => bread.resumePreviousStep());
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
      <Box mt="1rem">
        {bread.steps.map((step: Step, index) => (
          <StepView
            step={step}
            key={`step_${index}`}
            isCurrent={bread.currentStepIndex === index}
            isFirst={index === 0}
            isLast={index === bread.steps.length - 1}
            onStart={handleStartStep}
            onContinue={handleContinue}
            onReset={handleReset}
            onResumePrevious={handleResumePrevious}
          />
        ))}
      </Box>
    </Page>
  );
}
