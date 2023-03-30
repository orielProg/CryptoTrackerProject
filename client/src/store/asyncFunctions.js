import { chartActions } from "./chart";
import axios from "axios";
import { cardsActions } from "./cards";
import tokens, { tokensActions } from "./tokens";
import { topCoinsActions } from "./topcoins";

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

export const checkIfCanBeCharted = (contractAddress,infoPopUp) => {
  return (dispatch) => {
    if (
      !contractAddress.startsWith("0x") &&
      contractAddress !== "eth" &&
      contractAddress !== "btc"
    ) {
      infoPopUp();
      return;
    }
    return axios
      .post("/app/check-contract-address", { contractAddress })
      .then((data) =>
        dispatch(tokensActions.setTokenInfo({ ...data.data, contractAddress }))
      ).catch(error => {
        infoPopUp();
      })
  };
};

export const fetchPrediction = (contractAddress, setPrediction) => {
  return (dispatch) => {
    return axios
      .get("/app/get-token-prediction",{params : {contractAddress}})
      .then((data) =>
        dispatch(() => {setPrediction(data.data.result)})
      ).catch(error => {
        console.log(error);
      })
  };
}

export const fetchTopCoins = () => {
  return (dispatch) => {
    dispatch(topCoinsActions.setLoading(true));
    axios
      .get("/app/get-top-coins")
      .then((res) => {
        dispatch(topCoinsActions.setExpirationDate(Date.now()+600000))
        dispatch(topCoinsActions.setTopCoins(res.data));
      })
      .catch((err) => {
        if (err && err.response && err.response.message)
          dispatch(topCoinsActions.setError(err.response.message));
        else dispatch(topCoinsActions.setError(err.message));
      });
    dispatch(topCoinsActions.setLoading(false));
  };
}