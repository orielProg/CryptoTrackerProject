import {
  Card,
  CardContent,
  Typography,
  Button,
  CardMedia,
  CardActions,
  Grid,
} from "@mui/material";

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { green, red, common } from "@mui/material/colors";
import { useSnackbar } from "notistack";

import { useEffect, useContext } from "react";
import axios from "axios";
import { LoggedInContext } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { cardsActions } from "../store/cards";
import { loadCards } from "../store/asyncFunctions";
import { getCards } from "./default_cards_state";
import RemoveIcon from "@mui/icons-material/Remove";

const NaturalTrend = <RemoveIcon sx={{ color: common[500] }} />;
const UpwardTrend = <ArrowUpwardIcon sx={{ color: green[500] }} />;
const DownwardTrend = <ArrowDownwardIcon sx={{ color: red[500] }} />;

const ContentCard = (props) => {
  const dispatch = useDispatch();
  const fetchCounter = useSelector((state) => state.tokens.fetchCounter);
  const tokens = useSelector((state) => state.tokens.tokens);
  const cardsDynamicElements = useSelector((state) => state.cards.cards);
  const error = useSelector((state) => state.cards.error);
  const cards =
    cardsDynamicElements.length === 0
      ? getCards()
      : getCards(cardsDynamicElements);

  const context = useContext(LoggedInContext);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    async function loadCardsFunc() {
      dispatch(loadCards());
      if (error)
        enqueueSnackbar(error, {
          variant: "error",
        });
    }
    loadCardsFunc();
  }, [fetchCounter,tokens]);

  return (
    <Grid container spacing={2}>
      {cards.map((element) => {
        return (
          <Grid key={element.alt} item xs={3}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={element.image}
                alt={element.alt}
              />
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h6"
                  component="div"
                  color="text.secondary"
                >
                  {element.header}
                </Typography>
                <Typography
                  gutterBottom
                  variant="h4"
                  style={{ fontWeight: 600 }}
                >
                  {element.value}
                </Typography>
                <Grid
                  container
                  direction="row"
                  alignContent="center"
                  spacing={1}
                >
                  <Grid item>
                    {element.trendValue === "0%" || element.trendValue === 0
                      ? NaturalTrend
                      : element.trend === "up"
                      ? UpwardTrend
                      : DownwardTrend}
                  </Grid>
                  <Grid item>
                    <Typography variant="body2">
                      {element.trendValue === "0%" || element.trendValue === 0
                        ? "No changes"
                        : element.trendValue}{" "}
                      since last check
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};
export default ContentCard;
