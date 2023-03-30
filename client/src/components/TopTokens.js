import { Paper } from "@mui/material";
import { Grid } from "@mui/material";
import {Divider,Card, CardContent} from "@mui/material";
import Tokens from "./Tokens";
import TopTokensUpperbar from "./TopTokensUpperBar";
import { CardHeader,Box, Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { fetchTopCoins } from "../store/asyncFunctions";
import { useEffect } from "react";

const rows = [
  {coin : "BTC", price : "123", oneh : "123", twentyfourh : "123", sevend : "123", twentyfourhvolume : "123", mkcap : "123", prediction : "123"},
  {coin : "ETH", price : "123", oneh : "123", twentyfourh : "123", sevend : "123", twentyfourhvolume : "123", mkcap : "123", prediction : "123"},
  {coin : "ADA", price : "123", oneh : "123", twentyfourh : "123", sevend : "123", twentyfourhvolume : "123", mkcap : "123", prediction : "123"},
  {coin : "DOGE", price : "123", oneh : "123", twentyfourh : "123", sevend : "123", twentyfourhvolume : "123", mkcap : "123", prediction : "123"},
  {coin : "DOT", price : "123", oneh : "123", twentyfourh : "123", sevend : "123", twentyfourhvolume : "123", mkcap : "123", prediction : "123"},
  {coin : "XRP", price : "123", oneh : "123", twentyfourh : "123", sevend : "123", twentyfourhvolume : "123", mkcap : "123", prediction : "123"},
  {coin : "UNI", price : "123", oneh : "123", twentyfourh : "123", sevend : "123", twentyfourhvolume : "123", mkcap : "123", prediction : "123"},
]

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
            <TableCell>Coin</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">1h</TableCell>
            <TableCell align="right">24h</TableCell>
            <TableCell align="right">7d</TableCell>
            <TableCell align="right">24h-volume</TableCell>
            <TableCell align="right">mkt-cap</TableCell>
            <TableCell align="right">Prediction</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {topCoins.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell align="right">{row.current_price.toLocaleString("en-US")
              }</TableCell>
              <TableCell align="right">{row.price_change_percentage_1h_in_currency.toLocaleString("en-US")}</TableCell>
              <TableCell align="right">{row.price_change_percentage_24h_in_currency.toLocaleString("en-US")}</TableCell>
              <TableCell align="right">{row.price_change_percentage_7d_in_currency.toLocaleString("en-US")
              }</TableCell>
              <TableCell align="right">{row.total_volume.toLocaleString("en-US")
              }</TableCell>
              <TableCell align="right">{row.market_cap.toLocaleString("en-US")}</TableCell>
              <TableCell align="right">{row.prediction}</TableCell>
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
