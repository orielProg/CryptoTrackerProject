import {
  Modal,
  Grid,
  Card,
  CardHeader,
  IconButton,
  Button,
  Divider,
  CardContent,
  Avatar,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Fragment } from "react";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { green, red } from "@mui/material/colors";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};



const TokenModal = (props) => {
  const open = props.tokenInfo ? true : false;
  const price = props && props.tokenInfo && props.tokenInfo.price ? props.tokenInfo.price : 0;
  const diff = props && props.tokenInfo && props.tokenInfo.diff ? props.tokenInfo.diff : 0;
  const image = props && props.tokenInfo && props.tokenInfo.image ? props.tokenInfo.image : "";
  console.log(image)
  const name = props && props.tokenInfo && props.tokenInfo.name ? props.tokenInfo.name : "";
  const symbol = props && props.tokenInfo && props.tokenInfo.symbol ? props.tokenInfo.symbol : "";

  const TopComponent = (
    <Grid container alignItems={"center"}>
      
      <Typography variant="h4" color="text.primary" sx = {{paddingRight : 1}}>
        ${price}
      </Typography>
      {diff>=0 && <ArrowUpwardIcon sx={{ color: green[500], fontSize: "100"}} />}
      {diff<0 && <ArrowDownwardIcon sx={{ color: red[500], fontSize: "100"}} />}
      <Typography variant="h6" color={diff>=0 ? green[500] : red[500]}>
        {(Math.abs(diff)).toFixed(2)}%
      </Typography>
    </Grid>
  );



  return (
    <Modal
      open={open}
      onClose={props.handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Grid container xs={8} justifyContent="center" style={style}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              avatar={
                <Avatar
                  src={image}
                  aria-label="token-image"
                />
              }
              title={name + " ("+symbol.toUpperCase()+")"}
              titleTypographyProps={{ variant: "h6" }}
              subheader={TopComponent}
              action={
                <IconButton aria-label="add" onClick={props.handleClose}>
                  <CloseIcon />
                </IconButton>
              }
            />

            <Divider />
            <CardContent>
            
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Modal>
  );
};

export default TokenModal;
