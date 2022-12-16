import { Box, Typography, Stack } from "@mui/material";
import { getBread } from "../model/store";
import { Timer } from "../model/timer";
import { getTimers, hasPermission } from "../timer-service";
import { theme } from "./App";
import { DurationView } from "./common/DurationView";

function TimerView(props: { timer: Timer }) {
  const bread = getBread(props.timer.breadUUID);
  const currentStep = bread.steps[bread.currentStepIndex];
  return (
    <Stack direction={"row"} spacing="2rem">
      <Box display="flex" alignItems="center">
        <DurationView step={currentStep} />
      </Box>
      <Box>
        <Typography variant="h6">{currentStep.name}</Typography>
        <Typography variant="subtitle2">{bread.name}</Typography>
      </Box>
    </Stack>
  );
}

export function TimersView() {
  const timers = getTimers();

  return (
    <Box
      mt="1rem"
      flexDirection="column"
      padding={"1rem"}
      border={1}
      borderRadius={2}
      bgcolor={theme.palette.primary.light}
      color={theme.palette.primary.contrastText}
    >
      {timers.map((timer) => {
        return <TimerView timer={timer} key={"timer_" + timer.breadUUID} />;
      })}
      <Typography>Has permission: {hasPermission().toString()}</Typography>
    </Box>
  );
}
