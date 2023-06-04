import Chart from "react-apexcharts";
import { Grid, Toolbar } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import { useEffect, useState } from "react";
import axios from "axios";

let state = {
  options: {
    dataLabels: {
      enabled: false,
    },
    chart: {
      id: "area-datetime",
      type: "area",
      
      zoom: {
        autoScaleYaxis: true,
      },
    },
    xaxis: {
      type: "datetime",
      tickAmount: 12,
    },
    yaxis: {
      decimalsInFloat: 2,
    },
    markers: {
      size: 0,
      style: "hollow",
    },
    colors: ["#3832a0"],
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 100],
        gradientToColors: ["#000000"],
      },
    },
    tooltip: {
      enabled: true,
      fillSeriesColor: true,
      theme: "dark",
      x: {
        format: "dd MMM yyyy hh:mm",
        show: true,
      },
    },
  },
};

const TokenChart = (props) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(0);
  const [buttons, setButtons] = useState({
    active: 1,
    1: true,
    7: false,
    14: false,
    30: false,
    max: false,
  });

  const series = [
    {
      name: "Price",
      data: data,
    },
  ];

  useEffect(() => {
    async function fetchFunc(){
    console.log("Fetching");
    console.log(buttons.active == 7);
    const active = buttons.active;
    setLoading(buttons.active);
    const days = buttons.active;
    await axios
      .post("/app/get-token-chart", {
        contractAddress: props.tokenInfo.contractAddress,
        days,
      })
      .then((result) => setData(result.data))
      .catch((err) => console.log(err));
    setLoading(null);
  }
  fetchFunc();
}, [buttons, setLoading]);

  const clickHandler = (event) => {
    const buttonID = event.currentTarget.id;
    if (buttons.active == buttonID) return;
    let newLoadingButtons = {
      active: buttonID,
      "1": false,
      "7": false,
      "14": false,
      "30": false,
      max: false,
    };
    newLoadingButtons[buttonID] = true;
    setButtons({ ...newLoadingButtons });
  };
  console.log(loading);
  return (
    <Grid container justifyContent="center">
      <Grid container justifyContent="center" spacing={2}>
        <Grid item>
          <LoadingButton
            variant={buttons[1] ? "contained" : "outlined"}
            loading={loading == 1}
            id={"1"}
            onClick={clickHandler}
          >
            24H
          </LoadingButton>
        </Grid>
        <Grid item>
          {" "}
          <LoadingButton
            variant={buttons[7] ? "contained" : "outlined"}
            loading={loading == 7 ? true : false}
            id={"7"}
            onClick={clickHandler}
          >
            7D
          </LoadingButton>
        </Grid>
        <Grid item>
          {" "}
          <LoadingButton
            variant={buttons[14] ? "contained" : "outlined"}
            loading={loading == 14 ? true : false}
            id={"14"}
            onClick={clickHandler}
          >
            14D
          </LoadingButton>
        </Grid>
        <Grid item>
          {" "}
          <LoadingButton
            variant={buttons[30] ? "contained" : "outlined"}
            loading={loading == 30}
            id={"30"}
            onClick={clickHandler}
          >
            30D
          </LoadingButton>
        </Grid>
        <Grid item>
          {" "}
          <LoadingButton
            variant={buttons["max"] ? "contained" : "outlined"}
            loading={loading == "max"}
            id={"max"}
            onClick={clickHandler}
          >
            MAX
          </LoadingButton>
        </Grid>
      </Grid>
      <Grid item xs={9}>
        <Chart options={state.options} series={series} type="area"></Chart>
      </Grid>
    </Grid>
  );
};

export default TokenChart;
