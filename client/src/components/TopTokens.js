import { Paper } from "@mui/material";
import { Grid } from "@mui/material";
import {Divider,Card, CardContent,Avatar} from "@mui/material";
import Tokens from "./Tokens";
import TopTokensUpperbar from "./TopTokensUpperBar";
import { CardHeader,Box, Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { fetchTopCoins } from "../store/asyncFunctions";
import { useEffect } from "react";
import { green, red } from "@mui/material/colors";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const UpwardTrend = (
  <ArrowUpwardIcon sx={{ color: green[500] }} style={{ paddingRight: 2 }} />
);
const DownwardTrend = (
  <ArrowDownwardIcon sx={{ color: red[500] }} style={{ paddingRight: 2 }} />
);

const firstLetterCapital = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

const getTrend = (diff) =>{
          const trendIcon = diff < 0
            ? DownwardTrend
            : UpwardTrend;
        return (
          <Grid container>
            {trendIcon}
            {Math.abs(diff).toFixed(2).toLocaleString("en-US")}%
          </Grid>
        );}


const TopTokens = (props) => {

  const dispatch = useDispatch();
  const topCoins = useSelector((state) => state.topCoins.tokens)
  const expirationDate = useSelector((state) => state.topCoins.expirationDate)
  console.log(topCoins)
  const loading = useSelector((state) => state.topCoins.loading)

  const dataHandler = async () => {
    await dispatch(fetchTopCoins());
    console.log("dd");
  };

  useEffect(async () => {
    if(expirationDate<Date.now()){
      await dataHandler();
    }
  }, []);

  
  return (
    <Grid container xs={12} sx={{ height: "100%"}}>
      <Grid container xs={12} sx = {{position : "center", top : 0, width : "100%"}}>
        <Grid item xs={12}>
            <TopTokensUpperbar />
        </Grid>
      </Grid>
      <Grid container xs={12} spacing={3} p= {4} pr = {6} pl = {6} pt = {12} alignItems={"center"} alignContent={"center"} justifyContent={"center"}>
        <Grid item xs= {8}>
        <Card sx={{ height: "100%" }}>
        <CardHeader
          title="Recommended Tokens"
          titleTypographyProps={{ variant: "h4" }}
        />
        <Divider />
        <Grid item xs= {12} pt={3}>
        <TableContainer component={Paper} >
      <Table>
        <TableHead>
          <TableRow>
          <TableCell >Image</TableCell>
            <TableCell align="center">Coin</TableCell>
            <TableCell align="center">Price</TableCell>
            <TableCell align="center">1h</TableCell>
            <TableCell align="center">24h</TableCell>
            <TableCell align="center">7d</TableCell>
            <TableCell align="center">24h-volume</TableCell>
            <TableCell align="center">mkt-cap</TableCell>
            <TableCell align="center">Prediction</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {topCoins.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
              <Avatar src={row.image} sx={{ width: 35, height: 35 }} />
                
              </TableCell>
              <TableCell align="center">{firstLetterCapital(row.id)}</TableCell>
              <TableCell align="center">{"$"+row.current_price.toLocaleString("en-US")
              }</TableCell>
              <TableCell align="center">{getTrend(row.price_change_percentage_1h_in_currency)}</TableCell>
              <TableCell align="center">{getTrend(row.price_change_percentage_24h_in_currency)}</TableCell>
              <TableCell align="center">{getTrend(row.price_change_percentage_7d_in_currency)}</TableCell>
              <TableCell align="center">{"$"+row.total_volume.toLocaleString("en-US")
              }</TableCell>
              <TableCell align="center">{"$"+row.market_cap.toLocaleString("en-US")}</TableCell>
              <TableCell align="center">{firstLetterCapital(row.prediction)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Grid>
    </Card>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default TopTokens;
