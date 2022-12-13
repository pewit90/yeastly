import AddCircleIcon from "@mui/icons-material/AddCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { Box, Checkbox, IconButton, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import { produce } from "immer";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Bread } from "../model/bread";
import { Step } from "../model/step";
import { getBread, storeBread } from "../model/store";
import { Page } from "./common/Page";
import { ProgressStepperElement } from "./common/ProgressStepperElement";

function EditStep(props: {
  step: Step;
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
  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStep = produce(props.step, (draft) => {
      draft.duration = +e.target.value;
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
  );
  const icon = <RadioButtonUncheckedIcon fontSize="large" color="primary" />;
  const right = (
    <>
      <Stack direction={"row"} width="100%">
        <TextField
          label="Step Name"
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
      </Stack>
      <Box>
        <TextField
          label="Step Description"
          multiline
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
      <Box>
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
    </>
  );
  return ProgressStepperElement({
    left: left,
    icon: icon,
    right: right,
    isLast: false,
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
        icon={
          <AddCircleIcon
            fontSize="large"
            color="secondary"
            onClick={() => handleAddStep()}
          />
        }
        isLast={true}
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
  return (
    <Page title="Edit Bread" navigationIcon={navigationIcon}>
      <Stack padding={5}>
        <TextField
          label="Name"
          value={bread.name}
          onChange={(e) => handleBreadNameChange(e.target.value)}
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
