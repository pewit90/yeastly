import { Box } from "@mui/material";
import { ReactElement } from "react";

export function ProgressStepperElement(props: {
  left?: ReactElement;
  icon: ReactElement;
  right?: ReactElement;
  isLast: Boolean;
}) {
  return (
    <Box sx={{ display: "flex", gap: "0.4rem", width: "100%" }}>
      <Box
        sx={{
          mt: "0.45rem",
          width: "5rem",
          fontWeight: "bold",
          textAlign: "right",
        }}
      >
        {props.left}
      </Box>
      <Box
        sx={{
          flex: 0,
          minWidth: "3rem",
          minHeight: "4rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {props.icon}
        {!props.isLast && (
          <Box
            component="span"
            sx={{ flex: "1", width: "1px", backgroundColor: "text.secondary" }}
          ></Box>
        )}
      </Box>
      <Box sx={{ flex: 1, paddingBottom: "0.2rem" }}>{props.right}</Box>
    </Box>
  );
}
