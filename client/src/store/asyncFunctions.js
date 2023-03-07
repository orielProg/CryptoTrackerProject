import { chartActions } from "./chart";
import axios from "axios";
import { cardsActions } from "./cards";
import tokens, { tokensActions } from "./tokens";

export const loadChart = () => {
  console.log("loading chart with redux");
  return (dispatch) => {
    dispatch(chartActions.setLoading(true));
    axios
      .get("/app/chart")
      .then((res) => {
        dispatch(chartActions.updateChart(res.data));
      })
      .catch((err) => {
        if (err && err.response && err.response.message)
          dispatch(chartActions.setError(err.response.message));
        else dispatch(chartActions.setError(err.message));
      });
    dispatch(chartActions.setLoading(false));
  };
};

export const loadCards = () => {
  console.log("loading cards with redux");
  return (dispatch) => {
    dispatch(cardsActions.setLoading(true));
    axios
      .get("/app/cards")
      .then((res) => {
        dispatch(cardsActions.updateCards(res.data));
      })
      .catch((err) => {
        if (err && err.response && err.response.message)
          dispatch(cardsActions.setError(err.response.message));
        else dispatch(cardsActions.setError(err.message));
      });
    dispatch(cardsActions.setLoading(false));
  };
};

const uploadTokensToDB = (dispatch) => {
  dispatch(tokensActions.setLoading(true));
  return axios
    .get("/app/fetch-tokens")
    .then(() => {
      dispatch(tokensActions.setFetchCounter(1));
    })
    .catch((err) => {
      if (err && err.response && err.response.message)
        dispatch(tokensActions.setError(err.response.message));
      else dispatch(tokensActions.setError(err.message));
    });
};

const loadTokens = (dispatch, page, itemsPerPage, rowCount, sortingModel) => {
  dispatch(tokensActions.setLoading(true));
  return axios
    .post("/app/get-tokens", { page, itemsPerPage, rowCount, sortingModel })
    .then((res) => {
      dispatch(tokensActions.setLoading(false));
      dispatch(tokensActions.updateTokens(res.data.assets));
      if (rowCount === 0) dispatch(tokensActions.setRowCount(res.data.size));
    })
    .catch((err) => {
      if (err && err.response && err.response.message)
        dispatch(tokensActions.setError(err.response.message));
      else dispatch(tokensActions.setError(err.message));
    });
  //  dispatch(tokensActions.setLoading(false));
};

export const uploadAndLoadTokens = (
  page,
  itemsPerPage,
  rowCount,
  sortingModel
) => {
  return (dispatch) => {
    uploadTokensToDB(dispatch).then(() => {
      return loadTokens(dispatch, page, itemsPerPage, rowCount, sortingModel);
    });
  };
};

export const getTokens = (page, itemsPerPage, rowCount, sortingModel) => {
  return (dispatch) => {
    return loadTokens(dispatch, page, itemsPerPage, rowCount, sortingModel);
  };
};

