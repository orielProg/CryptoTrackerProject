import TokenChart from "./TokenChart";
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
  Alert,
  AlertTitle,
  Collapse,
  Box,
  Container,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import Slider from "@mui/material/Slider";

import CloseIcon from "@mui/icons-material/Close";
import { Fragment } from "react";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { green, red } from "@mui/material/colors";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchPrediction } from "../store/asyncFunctions";
import "../theme/customLoading.css";
import PredictionsChart from "./PredictionsChart";
import InsightsIcon from '@mui/icons-material/Insights';

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const CustomLoadingButton = (
  <div class="lds-circle">
    <div></div>
  </div>
);

const TokenModal = (props) => {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState("");
  const dispatch = useDispatch();
  const open = props.tokenInfo ? true : false;
  const price =
    props && props.tokenInfo && props.tokenInfo.price
      ? props.tokenInfo.price
      : 0;
  const diff =
    props && props.tokenInfo && props.tokenInfo.diff ? props.tokenInfo.diff : 0;
  const image =
    props && props.tokenInfo && props.tokenInfo.image
      ? props.tokenInfo.image
      : "";
  console.log(image);
  const name =
    props && props.tokenInfo && props.tokenInfo.name
      ? props.tokenInfo.name
      : "";
  const symbol =
    props && props.tokenInfo && props.tokenInfo.symbol
      ? props.tokenInfo.symbol
      : "";

  const predictButton = () => {
    return loading ? (
      CustomLoadingButton
    ) : (
      <Button variant="contained" size="big" onClick={predictHandler}>
        PREDICT
      </Button>
    );
  };

  const marks = [
    {
      value: 0,
      label: "Strong Sell",
    },
    {
      value: 25,
      label: "Sell",
    },
    {
      value: 50,
      label: "Neutral",
    },
    {
      value: 75,
      label: "Buy",
    },
    {
      value: 100,
      label: "Strong Buy",
    },
  ];

  const marksMap = {
    "strong sell": 0,
    sell: 25,
    neutral: 50,
    buy: 75,
    "strong buy": 100,
  };

  const TopComponent = (
    <Grid container alignItems={"center"}>
      <Typography variant="h4" color="text.primary" sx={{ paddingRight: 1 }}>
        ${price.toLocaleString("en-US")}
      </Typography>
      {diff >= 0 && (
        <ArrowUpwardIcon sx={{ color: green[500], fontSize: "100" }} />
      )}
      {diff < 0 && (
        <ArrowDownwardIcon sx={{ color: red[500], fontSize: "100" }} />
      )}
      <Typography variant="h6" color={diff >= 0 ? green[500] : red[500]}>
        {Math.abs(diff).toFixed(2)}%
      </Typography>
    </Grid>
  );

  const predictHandler = async () => {
    setLoading(true);
    await dispatch(
      fetchPrediction(props.tokenInfo.contractAddress, setPrediction)
    );
    console.log("predicting");
    setLoading(false);
    console.log(prediction);
  };

  const closeModel = () => {
    console.log("LOLLLL");
    setPrediction("");
    props.handleClose();
  };

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    // height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        // height: window.innerHeight,
      });
      console.log('changeddd')
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const { width } = windowSize;

  return (
    <Modal
      open={open}
      onClose={closeModel}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Grid container xs={8} justifyContent="center" style={style}>
        <Grid item xs={10}>
          <Card>
            <CardHeader
              avatar={<Avatar src={image} aria-label="token-image" />}
              title={name + " (" + symbol.toUpperCase() + ")"}
              titleTypographyProps={{ variant: "h6" }}
              subheader={TopComponent}
              action={
                <IconButton aria-label="add" onClick={closeModel}>
                  <CloseIcon />
                </IconButton>
              }
            />

            <Divider />
            <CardContent>
              <TokenChart tokenInfo={props.tokenInfo} />
              <Divider />
              <Grid container xs={12} justifyContent="center" margin={2}>
                {/* <Grid item xs={12}> */}
                  <Grid item xs={12} container spacing={1}>
                    <Grid><InsightsIcon sx={{ fontSize: "40px" }}></InsightsIcon></Grid>
                    <Grid item xs={4}><Typography variant="h5">Price Prediction</Typography></Grid>
                  </Grid>
                  <Grid item xs={4} marginTop={0}><PredictionsChart width={width*0.2}/></Grid>
                  {/* <div style={{ padding:0, margin:0 }}>
                    <PredictionsChart></PredictionsChart>
                  </div> */}
                  
                  {/* <Alert
                    severity="info"
                    variant="filled"
                    color="info"
                    action={
                      <Fragment>
                        {!prediction ? (
                          <Grid container alignItems="center" spacing={1} xs={12}>
                            <Grid item xs={12}>
                              <PredictionsChart />
                            </Grid>
                          </Grid>
                        ) : (
                          predictButton()
                        )}
                      </Fragment>
                    }
                  >
                    <AlertTitle>Price Prediction</AlertTitle>
                    {!loading && !prediction
                      ? "Click the button for price prediction!"
                      : prediction
                      ? "This recommendation is based on technical machine learning, and therefore, we advise you to consult with a certified investment advisor."
                      : "Please wait, it might take a few seconds"}
                  </Alert> */}
                {/* </Grid> */}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Modal>
  );
};

export default TokenModal;
