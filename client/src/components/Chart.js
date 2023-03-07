import { useTheme } from "@emotion/react";
import {
  Card,
  Box,
  Divider,
  CardHeader,
  Typography,
  Grid,
  Avatar,
} from "@mui/material";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useState, useEffect, useContext } from "react";
import { Icon } from "@iconify/react";
import { useSnackbar } from "notistack";

import { LoggedInContext } from "../App";
import { useDispatch,useSelector } from "react-redux";
import { chartActions } from "../store/chart";
import { loadChart } from "../store/asyncFunctions";

ChartJS.register(ArcElement, Tooltip, Legend);

const colorsArray = ["#3F51B5", "#E53935", "#FB8C00"];

const Chart = (props) => {
  const dispatch = useDispatch();
  const chart = useSelector((state) => state.chart.chart)
  const fetchCounter = useSelector((state) => state.tokens.fetchCounter);
  const error = useSelector((state) => state.chart.error)
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();


  useEffect(async () => {
      dispatch(loadChart());
      if(error) enqueueSnackbar(error, {
        variant: "error",
      });
      console.log("useEffect",chart);
  }, [fetchCounter]);

  const data = {
    datasets: [
      {
        data: chart
          ? chart.map((element) => element.total)
          : [0, 0, 0],
        backgroundColor: ["#3F51B5", "#e53935", "#FB8C00"],
        borderWidth: 8,
        borderColor: theme.palette.background.paper,
        hoverBorderColor: theme.palette.background.paper,
      },
    ],
    labels: ["BTC", "ETH", "NFT"],
  };

  const bottom = chart.map((element, index) => ({
    title: element.type.toUpperCase(),
    value: element.total,
    color: colorsArray[index],
    icon:
      element.type === "eth" ? (
        <Icon icon="cryptocurrency:eth" width="50" height="50" color="gray" />
      ) : element.type === "nft" ? (
        <Avatar
          src={
            "https://storage.googleapis.com/opensea-static/Logomark/Logomark-Blue.png"
          }
          sx={{ width: 50, height: 50 }}
        />
      ) : (
        <Avatar
          src={"https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579"}
          sx={{ width: 50, height: 50 }}
        />
      ),
  }));

  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader title="Chart" titleTypographyProps={{ variant: "h4" }} />
      <Divider />
      <Grid container xs={12} justifyContent="center">
        <Grid item xs={8}>
          <Doughnut data={data} />
        </Grid>
      </Grid>
      <Grid container xs={12} justifyContent="center">
        {bottom.map(({ color, title, value, icon }) => (
          <Box
            key={title}
            sx={{
              p: 1,
              textAlign: "center",
            }}
          >
            <Grid container justifyContent={"center"}>
              {icon}
            </Grid>
            <Typography color="textPrimary" variant="body1">
              {title}
            </Typography>
            <Typography style={{ color }} variant="h4">
              {value}%
            </Typography>
          </Box>
        ))}
      </Grid>
    </Card>
  );
};

export default Chart;
