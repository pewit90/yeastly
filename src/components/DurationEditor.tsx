import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Button, IconButton, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { Box } from "@mui/system";
import { minutesToHours } from "date-fns";
import { useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";

function TimeInterval(props: { unit: string; value: string }) {
  return (
    <Typography sx={{ mx: "0.6rem" }}>
      {props.value + " " + props.unit}
    </Typography>
  );
}

function Display(props: { localDuration: string }) {
  const localDuration = props.localDuration;
  return (
    <Box
      display={"flex"}
      width={"100%"}
      justifyContent={"center"}
      sx={{ my: "0.5rem" }}
    >
      <TimeInterval unit="d" value={localDuration.slice(0, 2)} />
      <TimeInterval unit="h" value={localDuration.slice(2, 4)} />
      <TimeInterval unit="m" value={localDuration.slice(4, 6)} />
    </Box>
  );
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

function DurationEditorButton(props: {
  title: string;
  handleClick: () => void;
}) {
  return (
    <Button variant="contained" onClick={() => props.handleClick()}>
      {props.title}
    </Button>
  );
}

function getGridRow(props: {
  rowID: string;
  items: { value: string; operation: (input: string) => void }[];
}) {
  const row = props.items.map((item, index) => {
    const value = item.value;
    const operation = item.operation;
    return (
      <Grid
        xs={1}
        key={`${props.rowID}_${index}`}
        display="flex"
        justifyContent={"center"}
      >
        <DurationEditorButton
          title={value}
          handleClick={() => operation(value)}
        />
      </Grid>
    );
  });
  return row;
}

function getNumberGridRow(props: {
  rowID: string;
  range: { start: number; end: number };
  operation: (input: string) => void;
}) {
  const start = props.range.start;
  const end = props.range.end;
  const values = [];
  for (var i = start; i <= end; i++) {
    values.push(i);
  }
  const gridRow = getGridRow({
    rowID: props.rowID,
    items: values.map((value) => {
      return { value: value.toString(), operation: props.operation };
    }),
  });
  return gridRow;
}

export function DurationEditor(props: {
  initialDuration?: number;
  handleSave: (newValue: number) => void;
}) {
  const localDurationDefault = "000000";
  const [localDuration, setLocalDuration] = useState(
    props.initialDuration
      ? minutesToLocalDuration(props.initialDuration)
      : localDurationDefault
  );
  const rollingConcat = (input: string) => {
    // shift left by input.length & concatenate input
    setLocalDuration(localDuration.slice(input.length) + input);
  };
  const shiftRight = () => {
    setLocalDuration("0" + localDuration.slice(0, localDuration.length - 1));
  };
  const clear = () => {
    setLocalDuration(localDurationDefault);
  };
  return (
    <Box display="flex" flexDirection={"column"}>
      <Display localDuration={localDuration} />
      {/* Number buttons */}
      <Grid
        container
        display={"flex"}
        rowSpacing={0.5}
        columnSpacing={1}
        columns={3}
      >
        {getNumberGridRow({
          rowID: "1",
          range: { start: 1, end: 3 },
          operation: rollingConcat,
        })}
        {getNumberGridRow({
          rowID: "2",
          range: { start: 4, end: 6 },
          operation: rollingConcat,
        })}
        {getNumberGridRow({
          rowID: "3",
          range: { start: 7, end: 9 },
          operation: rollingConcat,
        })}
        {/* Special Buttons */}
        {getGridRow({
          rowID: "4",
          items: [
            { value: "00", operation: rollingConcat },
            { value: "0", operation: rollingConcat },
            { value: ">>", operation: shiftRight },
          ],
        })}
        {/* Save/Clear */}
        <Grid xs={1}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <IconButton aria-label="save" onClick={() => clear()}>
              <CancelIcon sx={{ fontSize: "30px" }} color="secondary" />
            </IconButton>
          </Box>
        </Grid>
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
              onClick={() =>
                props.handleSave(localDurationToMinutes(localDuration))
              }
            >
              <CheckCircleIcon sx={{ fontSize: "30px" }} color="secondary" />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
