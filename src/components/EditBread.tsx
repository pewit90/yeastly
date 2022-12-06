import { Bread } from "../model/bread";
import { Page } from "./Page";
import { IconButton, TextField, Checkbox } from "@mui/material";
import { storeBread } from "../model/store";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Stack } from "@mui/system";
import { Step } from "../model/step";
import { produce } from "immer";
import React, { useState } from "react";

function EditStep(props: { step: Step; onChange: Function }) {
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
    <Stack>
      <TextField
        label="Step"
        value={props.step.name}
        onChange={handleNameChange}
      />
      <div>
        Autostart
        <Checkbox
          checked={props.step.autostart}
          onChange={handleAutostartChange}
        />
      </div>
      <div>
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
      </div>
    </Stack>
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
        {bread.steps.map((step, index) => (
          <EditStep
            step={step}
            key={"step_" + index}
            onChange={(newStep: Step) => {
              const newBread = produce(bread, (draft) => {
                draft.steps[index] = newStep;
              });
              setBread(newBread);
            }}
          />
        ))}
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
