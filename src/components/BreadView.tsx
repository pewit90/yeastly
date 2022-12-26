import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import Fab from "@mui/material/Fab";
import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Bread } from "../model/bread";
import { formatDuration, Step, stepDuration, StepState } from "../model/step";
import { getBread, storeBread } from "../model/store";
import { DurationView } from "./common/DurationView";
import { Page } from "./common/Page";
import { ProgressStepperElement } from "./common/ProgressStepperElement";

const leftProgressStepperWidth = "5rem";
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
    return <CompletedStep step={step} isLast={isLast} isFirst={isFirst} />;
  } else {
    return <PendingStep step={step} isLast={isLast} isFirst={isFirst} />;
  }
}

function CompletedStep(props: {
  step: Step;
  isLast: Boolean;
  isFirst: Boolean;
}) {
  const icon = <CheckCircleIcon color="primary" fontSize="large" />;
  const right = (
    <>
      {" "}
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
    </>
  );
  return ProgressStepperElement({
    leftWidth: leftProgressStepperWidth,
    icon: icon,
    right: right,
    isLast: props.isLast,
    isFirst: props.isFirst,
  });
}

function PendingStep(props: { step: Step; isLast: Boolean; isFirst: Boolean }) {
  const icon = <RadioButtonUncheckedIcon color="primary" fontSize="large" />;
  const right = (
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
  );
  return ProgressStepperElement({
    leftWidth: leftProgressStepperWidth,
    icon: icon,
    right: right,
    isLast: props.isLast,
    isFirst: props.isFirst,
  });
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
  const left = (
    <Box mt="0.5rem">
      <DurationView step={props.step} />
    </Box>
  );
  const icon = (
    <StepMenu
      onReset={
        props.step.state === StepState.STARTED ? props.onReset : undefined
      }
      onResumePrevious={!props.isFirst ? props.onResumePrevious : undefined}
    />
  );
  const right = (
    <>
      <Box
        width={"100%"}
        display={"flex"}
        justifyContent={"space-between"}
        flexWrap={"wrap"}
      >
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
        <Box justifyContent="end" gap="0.5rem">
          <StepControls
            state={props.step.state}
            onStart={props.onStart}
            onContinue={props.onContinue}
          />
        </Box>
      </Box>
      <Box display="flex" width={"100%"}>
        {props.step.description && (
          <Typography flex={1} variant="body2" mt="0.5rem">
            {props.step.description.split("\n").map((line) => (
              <>
                <span>{line}</span>
                <br />
              </>
            ))}
          </Typography>
        )}
      </Box>
    </>
  );
  return ProgressStepperElement({
    left: left,
    leftWidth: leftProgressStepperWidth,
    icon: icon,
    right: right,
    isLast: props.isLast,
    isFirst: props.isFirst,
  });
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

export function BreadView() {
  const params = useParams();
  const uuid = Number(params.uuid!);
  const [bread, setBread] = useState(() => getBread(uuid));
  const navigate = useNavigate();

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
    <Page title={bread.name}>
      {bread.description && (
        <Typography variant="subtitle1" my="2rem">
          {bread.description}
        </Typography>
      )}
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
      <Fab
        color="secondary"
        aria-label="edit"
        sx={{ position: "fixed", bottom: "2rem", right: "2rem" }}
        onClick={() => {
          navigate("/edit/" + uuid);
        }}
      >
        <ModeEditIcon />
      </Fab>
    </Page>
  );
}
