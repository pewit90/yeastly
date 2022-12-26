import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalculateIcon from "@mui/icons-material/Calculate";
import CottageIcon from "@mui/icons-material/Cottage";
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { ReactNode } from "react";
import { useNavigate } from "react-router";

export function Page(props: { title: string; children?: ReactNode }) {
  const navigate = useNavigate();
  return (
    <Container maxWidth={"md"}>
      <AppBar>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="back"
            sx={{ mr: 2 }}
            onClick={() => navigate(-1)}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            align="left"
            sx={{ flexGrow: 1 }}
          >
            {props.title}
          </Typography>

          <Box sx={{ mr: "0.5rem" }}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="back"
              onClick={() => navigate("/calculator")}
            >
              <CalculateIcon />
            </IconButton>
          </Box>

          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="back"
            onClick={() => navigate("/")}
          >
            <CottageIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box>
        <Toolbar />
        {props.children}
      </Box>
    </Container>
  );
}
