import { Box } from "@mui/material";
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
        <Box fontWeight="bold" textAlign="right">
          {formatDuration(remainingDuration(props.step))}
        </Box>
      )}
    />
  );
}
