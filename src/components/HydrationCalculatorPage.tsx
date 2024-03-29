import { Box, FilledInput, Typography } from "@mui/material";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import Grid from "@mui/material/Unstable_Grid2";
import { useState } from "react";
import { Hydration } from "../model/hydration";
import { Page } from "./common/Page";

function Label(props: { text: string }) {
  return <Typography variant="h6">{props.text}</Typography>;
}

function NumberDisplayField(props: { value: number; unit: string }) {
  return (
    <Box display="flex" mt="0.3rem">
      =
      <Typography align="right" sx={{ flex: "1" }}>
        {Math.round(props.value) + " " + props.unit}
      </Typography>
    </Box>
  );
}

function NumberInputField(props: {
  value: number;
  unit: string;
  onChange: Function;
  filled?: boolean;
}) {
  if (!props.filled) {
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
  } else {
    return (
      <FilledInput
        fullWidth
        value={props.value}
        type="number"
        color="warning"
        onChange={(e) => props.onChange(e.target.value)}
        endAdornment={
          <InputAdornment position="end">{props.unit}</InputAdornment>
        }
      />
    );
  }
}

export function HydrationCalculator(props: { hydration?: Hydration }) {
  const [hydration, setHydration] = useState(
    props.hydration ?? new Hydration(1000, 80, 2)
  );

  return (
    <Page title="Hydration Calculator">
      <Grid container spacing={3} margin={3}>
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
          <NumberDisplayField value={hydration.water} unit="ml" />
        </Grid>
        <Grid xs={4}>
          <Label text="Salt" />
        </Grid>
        <Grid xs={4}>
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
        <Grid xs={4}>
          <NumberDisplayField value={hydration.salt} unit="g" />
        </Grid>
      </Grid>
    </Page>
  );
}
