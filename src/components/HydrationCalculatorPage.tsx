import { Page } from "./Page";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Unstable_Grid2";
import { Typography } from "@mui/material";
import { Hydration } from "../model/hydration";
import React, { useState } from "react";

function NumberDisplayField(props: { label: string; value: number }) {
  return (
    <div style={{ display: "flex", maxWidth: "40%" }}>
      <div style={{ textAlign: "left" }}>
        <Typography color={"text.primary"} align="left">
          {props.label}
        </Typography>
      </div>
      <div style={{ textAlign: "right", flex: 1 }}>
        <Typography color={"text.secondary"}>{props.value}</Typography>
      </div>
    </div>
  );
}

function NumberInputField(props: {
  label: string;
  value: number;
  onChange: Function;
}) {
  return (
    <TextField
      id="outlined-number"
      label={props.label}
      type="number"
      value={props.value}
      sx={{ m: 2, maxWidth: "40%" }}
      onChange={(e) => props.onChange(e.target.value)}
    />
  );
}

export function HydrationCalculator(props: {}) {
  const [hydration, setHydration] = useState(new Hydration(1000, 0.8));
  return (
    <Page title="Hydration Calculator">
      <Grid>
        <Grid>
          <NumberInputField
            label="Flour"
            value={hydration.flour}
            onChange={(newValue: number) => {
              new Hydration(newValue, hydration.percentage);
            }}
          />{" "}
          <NumberInputField
            label="Percentage"
            value={hydration.percentage * 100}
            onChange={(newValue: number) => {
              setHydration(new Hydration(hydration.flour, newValue / 100));
            }}
          />{" "}
        </Grid>
        <Grid>
          <NumberDisplayField label="Water" value={hydration.water} />{" "}
        </Grid>
      </Grid>
    </Page>
  );
}
