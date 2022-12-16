import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { formatDuration, remainingDuration, Step } from "../../model/step";

function RefreshContainer(props: { content: () => JSX.Element }) {
  const [, setN] = useState(true);
  useEffect(() => {
    setInterval(() => setN((old) => !old), 1000);
  }, []);
  return <>{props.content()}</>;
}

export function DurationView(props: { step: Step }) {
  return (
    <RefreshContainer
      content={() => (
        <Box>
          <Typography variant="body1" align="right">
            {formatDuration(remainingDuration(props.step))}
          </Typography>
        </Box>
      )}
    />
  );
}
