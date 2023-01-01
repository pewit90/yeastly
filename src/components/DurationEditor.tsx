import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Button, IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { minutesToHours } from "date-fns";
import { useState } from "react";

function TimeInterval(props: { unit: string; value: string }) {
  return (
    <Typography variant="h5" sx={{ mx: "0.6rem" }}>
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
      sx={{ mb: "1rem" }}
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

function GridRow(props: {
  rowID: string;
  items: { value: string; operation: (input: string) => void }[];
}) {
  const row = props.items.map((item, index) => {
    const value = item.value;
    const operation = item.operation;
    return (
      <DurationEditorButton
        key={`${props.rowID}_${index}`}
        title={value}
        handleClick={() => operation(value)}
      />
    );
  });

  return <>{row}</>;
}

function NumberGridRow(props: {
  rowID: string;
  range: [number, number];
  operation: (input: string) => void;
}) {
  const [start, end] = props.range;
  const values = [];
  for (var i = start; i <= end; i++) {
    values.push(i);
  }
  return (
    <GridRow
      rowID={props.rowID}
      items={values.map((value) => ({
        value: value.toString(),
        operation: props.operation,
      }))}
    />
  );
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
    <Box display="flex" flexDirection={"column"} padding="1rem">
      <Display localDuration={localDuration} />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          columnGap: "1.5rem",
          rowGap: "1rem",
        }}
      >
        {/* Number buttons */}
        <NumberGridRow rowID="1" range={[1, 3]} operation={rollingConcat} />
        <NumberGridRow rowID="2" range={[4, 6]} operation={rollingConcat} />
        <NumberGridRow rowID="3" range={[7, 9]} operation={rollingConcat} />
        {/* Special Buttons */}
        <GridRow
          rowID="4"
          items={[
            { value: "00", operation: rollingConcat },
            { value: "0", operation: rollingConcat },
            { value: ">>", operation: shiftRight },
          ]}
        />
        {/* Save/Clear */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <IconButton aria-label="clear" onClick={() => clear()}>
            <CancelIcon
              sx={{ fontSize: "40px", mt: "0.5rem" }}
              color="secondary"
            />
          </IconButton>
        </Box>
        <Box />
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
            <CheckCircleIcon
              sx={{ fontSize: "40px", mt: "0.5rem" }}
              color="secondary"
            />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
