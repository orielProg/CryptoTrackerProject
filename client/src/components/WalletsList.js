import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Checkbox,
  IconButton,
  Grid,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

const WalletsList = (props) => {
  const noWallets = props.wallets.length === 0;

  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {props.wallets.map((value, index) => {
        const labelId = `checkbox-list-label-${value}`;

        return (
          <ListItem
            key={value}
            secondaryAction={
              <IconButton edge="end" aria-label="comments"></IconButton>
            }
            disablePadding
          >
            <ListItemButton
              id={value}
              role={undefined}
              onClick={props.handleToggle}
              dense
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={props.selected.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value} />
            </ListItemButton>
          </ListItem>
        );
      })}
      {noWallets && (
        <Grid container justifyContent={"center"}>
          <Grid item>
          
            <Typography variant="h6" color="text.secondary" >Please add wallets</Typography>
          </Grid>
        </Grid>
      )}
    </List>
  );
};

export default WalletsList;
