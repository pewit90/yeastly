import { Page } from "./Page";
import Grid from "@mui/material/Unstable_Grid2";
import { Typography } from "@mui/material";
import { Hydration } from "../model/hydration";
import React, { useState } from "react";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";

function Label(props: { text: string }) {
  return <Typography variant="h6">{props.text}</Typography>;
}

function NumberDisplayField(props: { value: number; unit: string }) {
  return <Typography align="right">{props.value + props.unit}</Typography>;
}

function NumberInputField(props: {
  value: number;
  unit: string;
  onChange: Function;
}) {
  return (
    <Input
      fullWidth
      value={props.value}
      type="number"
      onChange={(e) => props.onChange(e.target.value)}
      endAdornment={
        <InputAdornment position="end">{props.unit}</InputAdornment>
      }
    />
  );
}

export function HydrationCalculator(props: {}) {
  const [hydration, setHydration] = useState(new Hydration(1000, 80, 2));
  return (
    <Page title="Hydration Calculator">
      <Grid container spacing={2}>
        <Grid xs={4}>
          <Label text="Flour" />
        </Grid>
        <Grid xs={8}>
          <NumberInputField
            value={hydration.flour}
            unit="g"
            onChange={(newValue: number) => {
              setHydration(
                new Hydration(
                  newValue,
                  hydration.waterPercentage,
                  hydration.saltPercentage
                )
              );
            }}
          />
        </Grid>
        <Grid xs={4}>
          <Label text="Water" />
        </Grid>
        <Grid xs={4}>
          <NumberDisplayField value={hydration.water} unit="ml" />
        </Grid>
        <Grid xs={4}>
          {" "}
          <NumberInputField
            value={hydration.waterPercentage}
            unit="%"
            onChange={(newValue: number) => {
              setHydration(
                new Hydration(
                  hydration.flour,
                  newValue,
                  hydration.saltPercentage
                )
              );
            }}
          />
        </Grid>
        <Grid xs={4}>
          <Label text="Salt" />
        </Grid>
        <Grid xs={4}>
          <NumberDisplayField value={hydration.salt} unit="g" />
        </Grid>
        <Grid xs={4}>
          {" "}
          <NumberInputField
            value={hydration.saltPercentage}
            unit="%"
            onChange={(newValue: number) => {
              setHydration(
                new Hydration(
                  hydration.flour,
                  hydration.waterPercentage,
                  newValue
                )
              );
            }}
          />
        </Grid>
      </Grid>
    </Page>
  );
}
