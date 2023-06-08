import { Fragment, useEffect, useState } from "react";
import {
  CardHeader,
  Card,
  Grid,
  Typography,
  CardContent,
  Divider,
  Modal,
} from "@mui/material";
import UpperbarSettings from "./UpperbarSettings";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Checkbox,
  IconButton,
  Box,
  TextField,
  Button,
} from "@mui/material";
import WalletsList from "./WalletsList";
import AddIcon from "@mui/icons-material/Add";
import { useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
import EditWallets from "./EditWallets";
import ChangePassword from "./ChangePassword";

const Settings = (props) => {
  return (
    <Grid container sx={{ height: "100%" }}>
      <Grid item xs={12} sx = {{position : "fixed", top : 0, width : "100%"}}>
        <UpperbarSettings />
      </Grid>
      <Grid container justifyContent="center" pt = {9}>
        <Grid item xs={5} p={3} paddingLeft={0}>
          <Typography variant="h4" color="white">
            Settings
          </Typography>
        </Grid>
      </Grid>
      <EditWallets />
      <ChangePassword />
    </Grid>
  );
};

export default Settings;
