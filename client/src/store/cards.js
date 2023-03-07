import {createSlice} from "@reduxjs/toolkit"
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import {green,red} from "@mui/material/colors"
import { staticElements } from "../components/default_cards_state";


const cardsSlice = createSlice({
    name : "cards",
    initialState : {cards : [], loading : false, error : ""},
    reducers : {
        updateCards : (state,action) => {
            state.cards = action.payload;
        },
        setLoading : (state,action) => {
            state.loading = action.payload;
        },
        setError : (state,action) => {
            state.error = action.payload;
        }
    }
});

export const cardsActions = cardsSlice.actions;

export default cardsSlice.reducer;
