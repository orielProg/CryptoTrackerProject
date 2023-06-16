import { Fragment, useContext,useEffect,useState } from "react";
import { Toolbar, Avatar } from "@mui/material";
import { useTheme } from "@emotion/react";
import { Tooltip, IconButton } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { padding } from "@mui/system";
import LogoutIcon from "@mui/icons-material/Logout";
import { Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { LoggedInContext } from "../App";
import axios from "axios";
import { blue } from "@mui/material/colors";
import RecommendIcon from '@mui/icons-material/Recommend';

const Upperbar = (props) => {
  const navigate = useNavigate();
  const context = useContext(LoggedInContext);
  const theme = useTheme();
  

  const openSettings = () => {
    navigate("/settings")
  };
  const openTopCoins = () => {
    navigate("/recommended")
  }



  return (
    <Toolbar
      style={{
        backgroundColor: "#111827",
        boxShadow: theme.shadows[3],
        justifyContent: "space-between",
      }}
    >
      <Grid container>
        {" "}
        <Tooltip title="Logout">
          <IconButton onClick={props.logoutHandler}>
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </Grid>
      <Grid container justifyContent="right">
        {" "}
        <Tooltip title="Recommended Coins" sx={{ mr: 2 }}>
          <IconButton onClick={openTopCoins}>
            <RecommendIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Settings" sx={{ mr: 2 }}>
          <IconButton onClick={openSettings}>
            <SettingsIcon />
          </IconButton>
        </Tooltip>
        <Avatar sx={{ bgcolor: blue[700] }} src={context.picture} />
      </Grid>
    </Toolbar>
  );
};

export default Upperbar;
