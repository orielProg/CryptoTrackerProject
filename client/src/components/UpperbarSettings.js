import { Fragment, useContext } from "react";
import { Toolbar, Avatar } from "@mui/material";
import { useTheme } from "@emotion/react";
import { Tooltip, IconButton } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { padding } from "@mui/system";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { LoggedInContext } from "../App";
import { blue } from "@mui/material/colors";

const UpperbarSettings = (props) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const context = useContext(LoggedInContext);

  const backToDashboard = () => {
    navigate("/");
  };

  return (
    <Toolbar
      style={{
        backgroundColor: "#111827",
        boxShadow: theme.shadows[3],
        justifyContent: "space-between",
      }}
    >
      <Button
        variant="contained"
        startIcon={<ArrowBackIcon fontSize="small" />}
        onClick={backToDashboard}
      >
        Dashboard
      </Button>

      <Avatar sx={{ bgcolor: blue[700] }} src={context.picture} />
    </Toolbar>
  );
};

export default UpperbarSettings;
