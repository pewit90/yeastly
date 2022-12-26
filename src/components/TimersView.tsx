import { Box, Stack, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bread } from "../model/bread";
import { getBreads } from "../model/store";
import { hasNotificationPermission } from "../timer-service";
import { DurationView } from "./common/DurationView";

function TimerView(props: { bread: Bread }) {
  const navigate = useNavigate();
  const currentStep = props.bread.currentStep;
  if (currentStep === undefined) {
    throw Error("bread has no current step");
  }

  return (
    <Card
      variant="elevation"
      style={{ marginBottom: "1rem" }}
      onClick={() => navigate("/" + props.bread.uuid)}
    >
      <CardContent>
        <Stack direction={"row"} spacing="2rem">
          <Box display="flex" alignItems="center" width="4.5rem">
            <DurationView step={currentStep} />
          </Box>
          <Box>
            <Typography variant="h6">{currentStep.name}</Typography>
            <Typography variant="caption">{props.bread.name}</Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function getBreadsWithTimers(): Bread[] {
  return getBreads()
    .filter((bread) => {
      const currentStep = bread.currentStep;
      return currentStep?.timer !== undefined;
    })
    .sort(
      (a, b) =>
        a.currentStep!.timer!.dueAt.getTime() -
        b.currentStep!.timer!.dueAt.getTime()
    );
}

export function TimersView() {
  const [breads] = useState(() => getBreadsWithTimers());
  const [notificationPermissionStatus, setNotificationPermissionStatus] =
    useState("unknown");

  useEffect(() => {
    hasNotificationPermission().then((permissionState) =>
      setNotificationPermissionStatus(permissionState)
    );
  }, []);

  return (
    <Box mt="1rem" flexDirection="column" padding={"1rem"}>
      {breads.map((bread) => {
        return <TimerView bread={bread} key={"timer_" + bread.uuid} />;
      })}
      {/* <Typography variant="body2" align="right" my={"0.5rem"}>
        Has permission: {notificationPermissionStatus}
      </Typography> */}
    </Box>
  );
}
