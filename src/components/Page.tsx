import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material";
import { ReactNode } from "react";

export function Page(props: {
  title: string;
  navigationIcon?: ReactNode;
  fabButton?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Container maxWidth={"sm"}>
      <AppBar>
        <Toolbar>
          {props.navigationIcon}
          <Typography
            variant="h6"
            component="div"
            align="left"
            sx={{ flexGrow: 1 }}
          >
            {props.title}
          </Typography>
          {props.fabButton}
        </Toolbar>
      </AppBar>
      <Box>
        <Toolbar />
        {props.children}
      </Box>
    </Container>
  );
}
