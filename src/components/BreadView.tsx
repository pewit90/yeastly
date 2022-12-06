import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, Button, IconButton, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Bread } from "../model/bread";
import { Step, StepState } from "../model/step";
import { getBread, storeBread } from "../model/store";
import { Page } from "./Page";

export interface StepViewProps {
  step: Step;
  isCurrent?: boolean;
}

function StepView({ step, isCurrent }: StepViewProps) {
  return (
    <Box sx={{ display: "flex", gap: "0.4rem", width: "100%" }}>
      <Box sx={{ mt: "0.1rem", width: "3rem", fontWeight: "bold" }}>
        {isCurrent && "14:55"}
      </Box>
      <Box
        sx={{
          flex: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <StepStateIcon state={step.state} />
        <Box
          component="span"
          sx={{ flex: "1", width: "1px", backgroundColor: "text.secondary" }}
        ></Box>
      </Box>
      <Box sx={{ flex: 1, paddingBottom: "0.2rem" }}>
        <Typography
          variant="h6"
          sx={{ lineHeight: 1, mt: "0.5rem", mb: "0.5rem" }}
        >
          {step.name}
        </Typography>
        {isCurrent && (
          <Typography>Bake in Oven with 160 deg bla bla</Typography>
        )}
        <Box display="flex" mt="1rem" mb="2rem" justifyContent="start">
          {isCurrent && <Button variant="contained">Start</Button>}
        </Box>
      </Box>
    </Box>
  );
}

function StepStateIcon({ state }: { state: StepState }) {
  if (state === StepState.COMPLETED) {
    return <CheckCircleIcon fontSize="large" color="primary" />;
  } else if (state === StepState.PENDING) {
    return <RadioButtonUncheckedIcon fontSize="large" color="primary" />;
  } else {
    return <CircleNotificationsIcon fontSize="large" color="secondary" />;
  }
}

export function BreadView() {
  const params = useParams();
  const uuid = Number(params.uuid!);
  const [bread, setBread] = useState(() => getBread(uuid));
  const navigate = useNavigate();

  const navigationIcon = (
    <IconButton
      size="large"
      edge="start"
      color="inherit"
      aria-label="back"
      sx={{ mr: 2 }}
      onClick={() => navigate("/")}
    >
      <ArrowBackIcon />
    </IconButton>
  );

  const updateBread = (mutate: (bread: Bread) => Bread) => {
    const nextBread = mutate(bread);
    storeBread(nextBread);
    setBread(nextBread);
  };

  const handleContinue = () => {
    updateBread((bread) => bread.continue());
  };
  const handleBack = () => {
    updateBread((bread) => bread.back());
  };
  const handleStartStep = () => {
    updateBread((bread) => bread.startStep());
  };

  return (
    <Page title={bread.name} navigationIcon={navigationIcon}>
      <Box mt="5px">
        {bread.steps.map((step, index) => (
          <StepView step={step} isCurrent={bread.currentStepIndex === index} />
        ))}
      </Box>
    </Page>
  );
}
