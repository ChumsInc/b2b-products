import {ProductSeason} from "b2b-types";
import {createReducer} from "@reduxjs/toolkit";
import {loadSeasons} from "./actions";

export interface ProductSeasonList {
    [key: string]: ProductSeason,
}

export interface SeasonsState {
    list: ProductSeasonList;
    loading: boolean;
}

export const initialSeasonsState: SeasonsState = {
    list: {},
    loading: false,
}


const seasonsReducer = createReducer(initialSeasonsState, (builder) => {
    builder
        .addCase(loadSeasons.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadSeasons.fulfilled, (state, action) => {
            state.list = {};
            action.payload.filter(season => {
                state.list[season.code] = season;
            });
            state.loading = false;
        })
        .addCase(loadSeasons.rejected, (state) => {
            state.loading = false;
        })
})
export default seasonsReducer;
