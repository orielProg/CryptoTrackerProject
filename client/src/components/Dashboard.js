import { Drawer, Typography } from "@mui/material";
import { Paper } from "@mui/material";
import { Grid } from "@mui/material";
import { fontFamily } from "@mui/system";
import { Avatar } from "@mui/material";
import { Divider } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import Navitem from "./Navitem";
import LeftDash from "./LeftDash";
import ContentCard from "./ContentCard";
import Tokens from "./Tokens";
import Chart from "./Chart";
import { useState } from "react";
import { data } from "./default_cards_state";
import Upperbar from "./Upperbar";

const Dashboard = (props) => {

  return (
    <Grid container  sx={{ height: "100%"}}>
      <Grid container sx = {{position : "fixed", top : 0, width : "100%"}}>
        <Grid item xs={12}>
            <Upperbar />
        </Grid>
      </Grid>
      <Grid container spacing={3} p= {4} pr = {6} pl = {6} pt = {12}>
        <Grid item xs={12}>
          <ContentCard/>
        </Grid>
          <Grid item xs={8}>
            <Tokens/>
          </Grid>
          <Grid item xs={4} pr = {2}>
            <Chart/>
          </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
