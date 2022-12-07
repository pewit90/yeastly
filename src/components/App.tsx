import { createTheme, ThemeProvider } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import { getBreads } from "../model/store";
import "./App.css";
import { BreadHistory } from "./BreadHistory";
import { BreadView } from "./BreadView";
import { EditBread } from "./EditBread";
import { HydrationCalculator } from "./HydrationCalculatorPage";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#4E342E",
    },
    secondary: {
      main: "#ff6f00",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/" element={<BreadHistory />} />
        <Route path="/:uuid" element={<BreadView />} />
        <Route path="/edit" element={<EditBread />} />

        <Route path="/calculator" element={<HydrationCalculator />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
