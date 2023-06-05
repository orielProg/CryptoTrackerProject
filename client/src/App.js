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
import { createContext,useState,useEffect } from "react";
import Cookies from "js-cookie";
import PasswordRecover from "./components/PasswordRecover";
import { SnackbarProvider } from "notistack";
import Dashboard from "./components/Dashboard";
import Settings from "./components/Settings";
import TopTokens from "./components/TopTokens";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export const LoggedInContext = createContext();



function App() {
  const [picture, setPicture] = useState("");
  const [loggedIn, setLoggedIn] = useState(Cookies.get("loggedIn"));

  const logoutHandler = async () => {
    await axios
      .post("/app/logout")
      .then(() => {
        setLoggedIn(false);
        window.open("/login", "_self")
      })
      .catch((err) => console.log(err));
  };

  const getPicture = async () => {
    await axios
      .get("/app/get-picture")
      .then((res) => {
        setPicture(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    async function loggedInFunc(){
    if (loggedIn) await getPicture();
  }
  loggedInFunc();
}, []);

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
                <Route path="/" element={<Dashboard logoutHandler = {logoutHandler}/>} />
                <Route path="/recommended" element={<TopTokens logoutHandler = {logoutHandler}/>} />
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