import AddCircleIcon from "@mui/icons-material/AddCircle";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import {
  Box,
  Checkbox,
  IconButton,
  Popover,
  TextField,
  Typography,
} from "@mui/material";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import { Stack } from "@mui/system";
import { Duration, formatDuration } from "date-fns";
import { produce } from "immer";
import React, { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Bread } from "../model/bread";
import { Step } from "../model/step";
import { getBread, storeBread } from "../model/store";
import {
  durationToMinutes,
  minutesToDuration,
} from "../utils/conversion-utils";
import { Page } from "./common/Page";
import { ProgressStepperElement } from "./common/ProgressStepperElement";
import { DurationEditor } from "./DurationEditor";

const leftProgressStepperWidth = "0.5rem";

function NewDurationField(props: {
  duration: number;
  onDurationChange: Function;
}) {
  const [duration, setDuration] = useState(props.duration);
  const editIconRef = useRef(null);
  const [open, setOpen] = useState(false);
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: "9rem",
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <Typography>
        {formatDuration(minutesToDuration(props.duration))}
      </Typography>
      <IconButton ref={editIconRef} onClick={() => setOpen(true)}>
        <EditIcon />
      </IconButton>
      <Popover
        id="duration-popover"
        open={open}
        anchorEl={editIconRef.current}
        onClose={() => setOpen(false)}
      >
        <DurationEditor
          duration={duration}
          handleSave={(newValue) => {
            setDuration(newValue);
            props.onDurationChange(newValue);
            setOpen(false);
          }}
        />
      </Popover>
    </Box>
  );
}

function DurationField(props: {
  duration: number;
  onDurationChange: Function;
}) {
  const [duration, setDuration] = useState(minutesToDuration(props.duration));
  const handleChange = (newDuration: Duration) => {
    setDuration(newDuration);
    const minutes = durationToMinutes(newDuration);
    props.onDurationChange(minutes); // duration as number
  };
  const inputStyling = { width: "25%", ml: "1rem" };
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: "9rem",
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <Input
        error={duration.days !== undefined && duration.days < 0}
        value={duration.days}
        sx={{ ...inputStyling, ml: 0 }}
        type="number"
        onChange={(e) => {
          const newDuration: Duration = {
            ...duration,
            days: +e.target.value,
          };
          handleChange(newDuration);
        }}
        endAdornment={<InputAdornment position="end">d</InputAdornment>}
      />
      <Input
        error={
          duration.hours !== undefined &&
          (duration.hours < 0 || duration.hours >= 24)
        }
        value={duration.hours}
        sx={inputStyling}
        type="number"
        onChange={(e) => {
          const newDuration: Duration = {
            ...duration,
            hours: +e.target.value,
          };
          handleChange(newDuration);
        }}
        endAdornment={<InputAdornment position="end">h</InputAdornment>}
      />
      <Input
        error={
          duration.minutes !== undefined &&
          (duration.minutes < 0 || duration.minutes >= 60)
        }
        value={duration.minutes}
        sx={inputStyling}
        type="number"
        onChange={(e) => {
          const newDuration: Duration = {
            ...duration,
            minutes: +e.target.value,
          };
          handleChange(newDuration);
        }}
        endAdornment={<InputAdornment position="end">m</InputAdornment>}
      />
    </Box>
  );
}

function EditStep(props: {
  step: Step;
  isFirst: Boolean;
  onPropertyChange: Function;
  onMoveUp: Function;
  onMoveDown: Function;
  onDelete: Function;
}) {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStep = produce(props.step, (draft) => {
      draft.name = e.target.value;
    });
    props.onPropertyChange(newStep);
  };
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStep = produce(props.step, (draft) => {
      draft.description = e.target.value;
    });
    props.onPropertyChange(newStep);
  };
  const handleAutostartChange = (
    _e: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    const newStep = produce(props.step, (draft) => {
      draft.autostart = checked;
    });
    props.onPropertyChange(newStep);
  };
  const handleDurationChange = (newDuration: number) => {
    const newStep = produce(props.step, (draft) => {
      draft.duration = newDuration;
    });
    props.onPropertyChange(newStep);
  };
  const handleHasDurationChange = (
    _e: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    const newStep = produce(props.step, (draft) => {
      draft.duration = checked ? 0 : undefined;
    });
    props.onPropertyChange(newStep);
  };
  const left = (
    <Box
      sx={{
        width: "3rem",
        fontWeight: "bold",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
      }}
    >
      <ArrowUpwardIcon
        fontSize="large"
        color="primary"
        onClick={() => props.onMoveUp()}
      />
      <ArrowDownwardIcon
        fontSize="large"
        color="primary"
        sx={{ mt: "0.5rem" }}
        onClick={() => props.onMoveDown()}
      />
    </Box>
  );
  const icon = <RadioButtonUncheckedIcon fontSize="large" color="primary" />;
  const right = (
    <Box mb="3rem">
      <Box width={"100%"} display={"flex"} justifyContent={"space-between"}>
        <TextField
          label="Step Name"
          fullWidth
          sx={{ lineHeight: 1, mt: "0.5rem", mb: "0.5rem" }}
          value={props.step.name}
          onChange={handleNameChange}
        />
        <RemoveCircleIcon
          sx={{ mt: "1rem" }}
          fontSize="large"
          color="secondary"
          onClick={() => props.onDelete()}
        />
      </Box>
      <Box mt="0.5rem">
        <TextField
          label="Step Description"
          multiline
          fullWidth
          value={props.step.description}
          onChange={handleDescriptionChange}
        />
      </Box>
      <Box>
        Autostart
        <Checkbox
          checked={props.step.autostart}
          onChange={handleAutostartChange}
        />
      </Box>
      <Box
        width={"100%"}
        display={"flex"}
        alignItems={"center"}
        flexWrap="wrap"
      >
        Duration
        <Checkbox
          checked={props.step.duration !== undefined}
          onChange={handleHasDurationChange}
        />
        {props.step.duration !== undefined && (
          <>
            <NewDurationField
              duration={props.step.duration}
              onDurationChange={handleDurationChange}
            />
          </>
        )}
      </Box>
    </Box>
  );
  return ProgressStepperElement({
    left: left,
    leftWidth: leftProgressStepperWidth,
    icon: icon,
    iconOffset: "1.1rem",
    right: right,
    isLast: false,
    isFirst: props.isFirst,
  });
}

function EditSteps(props: { steps: Step[]; onChange: Function }) {
  const [steps, setSteps] = useState(props.steps);
  const handleAddStep = () => {
    const newStep = new Step("", false);
    const newSteps = produce(steps, (draft) => [...draft, newStep]);
    setSteps(newSteps);
    props.onChange(steps);
  };
  const handleStepPropertyChange = (newStep: Step, index: number) => {
    const newSteps = produce(steps, (draft) => {
      draft[index] = newStep;
    });
    setSteps(newSteps);
    props.onChange(newSteps);
  };
  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const newSteps = produce(steps, (draft) => {
        const el = draft[index];
        draft[index] = draft[index - 1];
        draft[index - 1] = el;
      });
      setSteps(newSteps);
      props.onChange(steps);
    }
  };
  const handleMoveDown = (index: number) => {
    if (index < steps.length - 1) {
      const newSteps = produce(steps, (draft) => {
        const el = draft[index];
        draft[index] = draft[index + 1];
        draft[index + 1] = el;
      });
      setSteps(newSteps);
      props.onChange(steps);
    }
  };
  const handleStepDeletion = (index: number) => {
    const newSteps = produce(steps, (draft) => {
      draft.splice(index, 1);
    });
    setSteps(newSteps);
    props.onChange(steps);
  };
  return (
    <Box mt="2rem">
      {steps.map((step, index) => (
        <EditStep
          step={step}
          isFirst={index === 0}
          key={"step_" + index}
          onPropertyChange={(newStep: Step) =>
            handleStepPropertyChange(newStep, index)
          }
          onMoveUp={() => handleMoveUp(index)}
          onMoveDown={() => handleMoveDown(index)}
          onDelete={() => handleStepDeletion(index)}
        />
      ))}
      <ProgressStepperElement
        leftWidth={leftProgressStepperWidth}
        icon={
          <AddCircleIcon
            fontSize="large"
            color="secondary"
            onClick={() => handleAddStep()}
          />
        }
        isLast={true}
        isFirst={steps.length === 1}
      />
    </Box>
  );
}

export function EditBread() {
  const params = useParams();
  const uuid: number | undefined = params.uuid
    ? (params.uuid as unknown as number)
    : undefined;
  const navigate = useNavigate();
  const timestamp = new Date();
  const [bread, setBread] = useState(
    uuid
      ? produce(getBread(uuid), (draft) => draft)
      : new Bread(
          timestamp.getTime(),
          "New Bread",
          [new Step("", false)],
          timestamp
        )
  );
  const handleBreadNameChange = (name: string) => {
    const newBread = produce(bread, (draft) => {
      draft.name = name;
    });
    setBread(newBread);
  };
  const handleBreadDescriptionChange = (description: string) => {
    const newBread = produce(bread, (draft) => {
      draft.description = description;
    });
    setBread(newBread);
  };
  return (
    <Page title="Edit Bread">
      <Stack padding={5}>
        <TextField
          label="Name"
          value={bread.name}
          onChange={(e) => handleBreadNameChange(e.target.value)}
        />
        <TextField
          label="Description"
          multiline
          fullWidth
          value={bread.description}
          onChange={(e) => handleBreadDescriptionChange(e.target.value)}
          sx={{ mt: "1rem" }}
        />
        <EditSteps
          steps={bread.steps}
          onChange={(stepList: Step[]) => {
            const newBread = produce(bread, (draft) => {
              draft.steps = stepList;
            });
            setBread(newBread);
          }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "end",
          }}
        >
          <IconButton
            edge="start"
            aria-label="Create"
            onClick={() => {
              storeBread(bread);
              navigate(-1);
            }}
          >
            <CheckCircleIcon sx={{ fontSize: "48px" }} color="secondary" />
          </IconButton>
        </Box>
      </Stack>
    </Page>
  );
}
