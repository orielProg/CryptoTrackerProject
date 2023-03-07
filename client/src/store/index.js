import { applyMiddleware, configureStore } from "@reduxjs/toolkit";
import tokensReducer from "./tokens";
import chartReducer from "./chart";
import cardsReducer from "./cards";
import thunk from "redux-thunk";

const store = configureStore({
  reducer: { tokens: tokensReducer, chart: chartReducer, cards: cardsReducer },
},applyMiddleware(thunk));

export default store;
