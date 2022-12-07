import { Bread } from "../model/bread";
import { Page } from "./Page";
import {
  IconButton,
  TextField,
  Box,
  Checkbox,
  Typography,
  Button,
} from "@mui/material";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { storeBread } from "../model/store";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Stack } from "@mui/system";
import { Step } from "../model/step";
import { produce } from "immer";
import React, { useState } from "react";

function EditStep(props: {
  step: Step;
  onChange: Function;
  onMoveUp: Function;
  onMoveDown: Function;
}) {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStep = produce(props.step, (draft) => {
      draft.name = e.target.value;
    });
    props.onChange(newStep);
  };
  const handleAutostartChange = (
    _e: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    const newStep = produce(props.step, (draft) => {
      draft.autostart = checked;
    });
    props.onChange(newStep);
  };
  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStep = produce(props.step, (draft) => {
      draft.duration = +e.target.value;
    });
    props.onChange(newStep);
  };
  const handleHasDurationChange = (
    _e: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    const newStep = produce(props.step, (draft) => {
      draft.duration = checked ? 0 : undefined;
    });
    props.onChange(newStep);
  };

  return (
    <Box sx={{ display: "flex", gap: "0.4rem", width: "100%" }}>
      <Box sx={{ mt: "4rem", width: "3rem", fontWeight: "bold" }}>
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
      <Box
        sx={{
          flex: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <RadioButtonUncheckedIcon fontSize="large" color="primary" />
        <Box
          component="span"
          sx={{ flex: "1", width: "1px", backgroundColor: "text.secondary" }}
        ></Box>
      </Box>
      <Box sx={{ flex: 1, paddingBottom: "0.2rem" }}>
        <TextField
          label="Step Description"
          sx={{ lineHeight: 1, mt: "0.5rem", mb: "0.5rem" }}
          value={props.step.name}
          onChange={handleNameChange}
          fullWidth
        />
        <Box>
          Autostart
          <Checkbox
            checked={props.step.autostart}
            onChange={handleAutostartChange}
          />
        </Box>
        <Box mt="1rem" mb="2rem" justifyContent="start">
          Duration
          <Checkbox
            checked={props.step.duration !== undefined}
            onChange={handleHasDurationChange}
          />
          {props.step.duration !== undefined && (
            <TextField
              type="number"
              value={props.step.duration}
              onChange={handleDurationChange}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}

function EditSteps(props: { steps: Step[]; onChange: Function }) {
  const [steps, setSteps] = useState(props.steps);
  const handleAddStep = () => {
    const newStep = new Step("", false);
    const newSteps = produce(steps, (draft) => [...draft, newStep]);
    setSteps(newSteps);
    props.onChange(steps);
  };
  const handleStepChange = (newStep: Step, index: number) => {
    const newSteps = produce(steps, (draft) => {
      draft[index] = newStep;
    });
    setSteps(newSteps);
    props.onChange(steps);
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
  return (
    <Box mt="2rem">
      {steps.map((step, index) => (
        <EditStep
          step={step}
          key={"step_" + index}
          onChange={(newStep: Step) => handleStepChange(newStep, index)}
          onMoveUp={() => handleMoveUp(index)}
          onMoveDown={() => handleMoveDown(index)}
        />
      ))}
      <Box sx={{ display: "flex", gap: "0.4rem", width: "100%" }}>
        <Box sx={{ mt: "0.1rem", width: "3rem", fontWeight: "bold" }} />
        <AddCircleIcon
          fontSize="large"
          color="secondary"
          onClick={() => handleAddStep()}
        />
      </Box>
    </Box>
  );
}

export function EditBread(props: { bread?: Bread }) {
  const timestamp = new Date();
  const [bread, setBread] = useState(
    props.bread
      ? props.bread
      : new Bread(
          timestamp.getTime(),
          "New Bread",
          [new Step("new", false)],
          timestamp
        )
  );
  return (
    <Page title="Edit Bread">
      <Stack padding={5}>
        <TextField label="Name" value={bread.name} />
        <EditSteps
          steps={bread.steps}
          onChange={(stepList: Step[]) => {
            const newBread = produce(bread, (draft) => {
              draft.steps = stepList;
            });
            setBread(newBread);
          }}
        />
        <IconButton
          edge="start"
          aria-label="Create"
          onClick={() => {
            storeBread(bread);
          }}
        >
          <AddCircleIcon />
        </IconButton>
      </Stack>
    </Page>
  );
}
