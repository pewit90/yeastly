import { Box, Stack, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBread } from "../model/store";
import { Timer } from "../model/timer";
import { getPendingTimers, hasNotificationPermission } from "../timer-service";
import { DurationView } from "./common/DurationView";

function TimerView(props: { timer: Timer }) {
  const navigate = useNavigate();
  const bread = getBread(props.timer.breadUUID);
  const currentStep = bread.steps[bread.currentStepIndex];
  return (
    <Card
      variant="elevation"
      style={{ marginBottom: "1rem" }}
      onClick={() => navigate("/" + bread.uuid)}
    >
      <CardContent>
        <Stack direction={"row"} spacing="2rem">
          <Box display="flex" alignItems="center">
            <DurationView step={currentStep} />
          </Box>
          <Box>
            <Typography variant="h6">{currentStep.name}</Typography>
            <Typography variant="caption">{bread.name}</Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export function TimersView() {
  const [timers, setTimers] = useState([] as Timer[]);
  const [notificationPermissionStatus, setNotificationPermissionStatus] =
    useState("unknown");

  const reloadValues = () => {
    getPendingTimers().then((timers) => setTimers(timers));
    hasNotificationPermission().then((permission) =>
      setNotificationPermissionStatus(permission)
    );
  };
  useEffect(() => {
    reloadValues();
  }, []);

  return (
    <Box mt="1rem" flexDirection="column" padding={"1rem"}>
      {timers.map((timer) => {
        return <TimerView timer={timer} key={"timer_" + timer.breadUUID} />;
      })}
      <Typography variant="body2" align="right" my={"0.5rem"}>
        Has permission: {notificationPermissionStatus}
      </Typography>
      <Button variant="contained" onClick={() => reloadValues()}>
        Reload
      </Button>
    </Box>
  );
}
