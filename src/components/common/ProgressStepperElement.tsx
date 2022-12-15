import { Box } from "@mui/material";
import { ReactElement } from "react";

export function ProgressStepperElement(props: {
  left?: ReactElement;
  leftWidth: string; // left should have a minWidth to ensure center lines are all aligned
  icon: ReactElement;
  iconOffset?: string;
  right?: ReactElement;
  isLast: Boolean;
  isFirst: Boolean;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        columnGap: "0.4rem",
        width: "100%",
      }}
    >
      <Box
        aria-label="left"
        sx={{
          display: "flex",
          minWidth: props.leftWidth,
          width: props.leftWidth,
          justifyContent: "flex-end",
        }}
      >
        {props.left}
      </Box>
      <Box
        aria-label="center"
        sx={{
          flex: 0,
          minWidth: "3rem",
          minHeight: "4rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {props.iconOffset && (
          <Box
            sx={{
              flex: "1",
              width: "1px",
              backgroundColor: props.isFirst ? "transparent" : "text.secondary",
              maxHeight: props.iconOffset,
            }}
          />
        )}
        {props.icon}
        {!props.isLast && (
          <Box
            component="span"
            sx={{
              flex: "1",
              width: "1px",
              mt: "0.1rem",
              backgroundColor: "text.secondary",
            }}
          ></Box>
        )}
      </Box>
      <Box aria-label="right" sx={{ flex: 1 }}>
        {props.right}
      </Box>
    </Box>
  );
}
