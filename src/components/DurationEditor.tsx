import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Button, IconButton } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { Box } from "@mui/system";
import { minutesToHours } from "date-fns";
import { useState } from "react";

function NumberButton(props: { number: string; handleClick: () => void }) {
  return (
    <Button variant="contained" onClick={() => props.handleClick()}>
      {props.number}
    </Button>
  );
}

function TimeInterval(props: { unit: string; value: string }) {
  return <p>{props.value + " " + props.unit}</p>;
}

function minutesToLocalDuration(minutes: number) {
  const dayString = Math.floor(minutesToHours(minutes) / 24)
    .toString()
    .padStart(2, "0");
  const hrsString = (minutesToHours(minutes) % 24).toString().padStart(2, "0");
  const minutesString = (minutes % 60).toString().padStart(2, "0");
  return dayString + hrsString + minutesString;
}

function localDurationToMinutes(localDuration: string): number {
  const days = +localDuration.slice(0, 2);
  const hrs = +localDuration.slice(2, 4);
  const mins = +localDuration.slice(4, 6);
  return days * 24 * 60 + hrs * 60 + mins;
}

export function DurationEditor(props: {
  duration?: number;
  handleSave: (newValue: number) => void;
}) {
  const [localDuration, setLocalDuration] = useState(
    props.duration ? minutesToLocalDuration(props.duration) : "000000"
  );
  const rollingConcat = (value: string) => {
    setLocalDuration(localDuration.slice(value.length) + value);
  };
  return (
    <Box width="20rem" height={"2orem"} display="flex" flexDirection={"column"}>
      <Box display={"flex"} width={"100%"} justifyContent={"space-evenly"}>
        <TimeInterval unit="d" value={localDuration.slice(0, 2)} />
        <TimeInterval unit="h" value={localDuration.slice(2, 4)} />
        <TimeInterval unit="m" value={localDuration.slice(4, 6)} />
      </Box>
      <Grid container rowSpacing={0.5} columnSpacing={1} columns={3}>
        {["1", "2", "3"].map((value, index) => (
          <Grid xs={1} key={"1_" + value}>
            <NumberButton
              number={value}
              handleClick={() => {
                rollingConcat(value);
              }}
            />
          </Grid>
        ))}
        {["4", "5", "6"].map((value, index) => (
          <Grid xs={1} key={"2_" + value}>
            <NumberButton
              number={value}
              handleClick={() => {
                rollingConcat(value);
              }}
            />
          </Grid>
        ))}
        {["7", "8", "9"].map((value, index) => (
          <Grid xs={1} key={"3_" + value}>
            <NumberButton
              number={value}
              handleClick={() => {
                rollingConcat(value);
              }}
            />
          </Grid>
        ))}
        {/* Special Buttons */}
        <Grid xs={1}>
          <Button
            variant="contained"
            onClick={() => {
              rollingConcat("00");
            }}
          >
            00
          </Button>
        </Grid>
        <Grid xs={1}>
          <Button
            variant="contained"
            onClick={() => {
              rollingConcat("0");
            }}
          >
            0
          </Button>
        </Grid>
        <Grid xs={1}>
          <Button
            variant="contained"
            onClick={() => {
              setLocalDuration(
                "0" + localDuration.slice(0, localDuration.length - 1)
              );
            }}
          >
            {">>"}
          </Button>
        </Grid>
        <Grid xs={1}></Grid>
        <Grid xs={1}></Grid>
        <Grid xs={1}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <IconButton
              aria-label="save"
              onClick={() => {
                props.handleSave(localDurationToMinutes(localDuration));
              }}
            >
              <CheckCircleIcon sx={{ fontSize: "30px" }} color="secondary" />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
