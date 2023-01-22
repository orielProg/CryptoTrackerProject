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


function App() {

  return (
    <ThemeProvider theme={theme}>
      
        <Router>
            {
              <Routes>
                <Route path="/password-reset" element={<ForgotPassword />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            }
        </Router>
    </ThemeProvider>
  );
}

export default App;