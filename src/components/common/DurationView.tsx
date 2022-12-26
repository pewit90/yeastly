import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useEffect, useState } from "react";
import {
  formatDuration,
  isStepOverdue as isStepDue,
  remainingDuration,
  Step,
} from "../../model/step";

function RefreshContainer(props: { content: () => JSX.Element }) {
  const [, setN] = useState(true);
  useEffect(() => {
    setInterval(() => setN((old) => !old), 1000);
  }, []);
  return <>{props.content()}</>;
}

export function DurationView(props: { step: Step }) {
  const isDue = isStepDue(props.step);
  return (
    <RefreshContainer
      content={() => (
        <Box>
          <Typography variant="body1" align="right" sx={{ display: "flex" }}>
            {formatDuration(remainingDuration(props.step), isDue)}
          </Typography>
          {isDue && <BlinkContainer />}
        </Box>
      )}
    />
  );
}

function BlinkContainer() {
  let icon;
  if (new Date().getSeconds() % 2 === 0) {
    icon = <NotificationsActiveIcon color="error" />;
  } else {
    icon = <NotificationsIcon color="primary" />;
  }
  return (
    <Box display="flex" justifyContent="center" marginTop="0.2rem">
      {icon}
    </Box>
  );
}
