import Register from "./components/Register";
import Login from "./components/Login";
import { ThemeProvider } from "@mui/material/styles";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { theme } from "./theme";
import ForgotPassword from "./components/ForgotPassword";
import { createContext,useState } from "react";
import Cookies from "js-cookie";
import PasswordRecover from "./components/PasswordRecover";
import { SnackbarProvider } from "notistack";
import Dashboard from "./components/Dashboard";
import Settings from "./components/Settings";


export const LoggedInContext = createContext();



function App() {
  const [picture, setPicture] = useState("");
  const [loggedIn, setLoggedIn] = useState(Cookies.get("loggedIn"));

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3}>
        <Router>
          <LoggedInContext.Provider
            value={{
              loggedIn,
              setLoggedIn,
              picture,
            }}
          >
            {!loggedIn && (
              <Routes>
                <Route
                  path="/password-reset/:id/:token"
                  element={<PasswordRecover />}
                />
                <Route path="/password-reset" element={<ForgotPassword />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            )}

            {loggedIn && (
              <Routes>
              <Route path="/settings" element={<Settings />} />
                <Route path="/" element={<Dashboard />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            )}
          </LoggedInContext.Provider>
        </Router>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;