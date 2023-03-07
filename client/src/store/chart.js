import {createSlice} from "@reduxjs/toolkit"


const chartSlice = createSlice({
    name : "chart",
    initialState : {chart : [], loading : false, error : ""},
    reducers : {
        updateChart : (state,action) => {
            state.chart = action.payload;
        },
        setLoading : (state,action) => {
            state.loading = action.payload;
        },
        setError : (state,action) => {
            state.error = action.payload;
        }
    }
});


export const chartActions = chartSlice.actions;

export default chartSlice.reducer;
