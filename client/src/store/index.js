import { applyMiddleware, configureStore,combineReducers } from "@reduxjs/toolkit";
import tokensReducer from "./tokens";
import chartReducer from "./chart";
import cardsReducer from "./cards";
import thunk from "redux-thunk";
import topCoinsReducer from "./topcoins";

const combinedReducer = combineReducers({
  
    tokens: tokensReducer,
    chart: chartReducer,
    cards: cardsReducer,
    topCoins: topCoinsReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "USER_LOGOUT") {
    // check for action type
    state = undefined;
  }
  return combinedReducer(state, action);
};

const store = configureStore({ reducer: rootReducer }, applyMiddleware(thunk));

export default store;
