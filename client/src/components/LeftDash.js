import { CardContent, Grid, Typography } from "@mui/material";
import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import InboxIcon from "@mui/icons-material/Inbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import { height } from "@mui/system";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import { Card } from "@mui/material";
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import { pink,deepPurple } from '@mui/material/colors';


const items = [
  { title: "Dashboard", icon: <DashboardIcon />, href: "dashboard", id : "dashboard" },
  { title: "Account", icon: <PersonIcon />, href: "account" ,id : "account"},
  { title: "Settings", icon: <SettingsIcon />, href: "settings",id : "settings" },
];



const LeftDash = (props) => {
  const [selected,setSelected] = useState("dashboard");

  const handleClick = event => {
    setSelected(event.currentTarget.id);
  }
  return (
    <Grid container sx={{ height: "100%" }}>
      <Grid item xs={12} sx={{ height: "100%",}}>
        <Box
          sx={{ width: "100%", bgcolor: "background.paper", height: "100%" }}
        >
        
        <CurrencyBitcoinIcon sx={{ color: deepPurple[600] }} fontSize="large"/>
          <Card>
            <CardContent><Typography>oriel10</Typography></CardContent>
          </Card>
          <Divider />
          <List sx={{ width: '100%'}}>
            {items.map((item) => {
              return (
                <ListItem disablePadding selected = {selected===item.id}>
                  <ListItemButton id = {item.id} onClick = {handleClick}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText
                      sx={{ color: "white" }}
                      primary={item.title}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Grid>
    </Grid>
  );
};

export default LeftDash;
