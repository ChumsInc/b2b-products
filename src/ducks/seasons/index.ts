import {ProductSeason} from "b2b-types";
import {RootState} from "../../app/configureStore";
import {fetchSeasons} from "../../api/seasonsAPI";
import {createAsyncThunk, createReducer} from "@reduxjs/toolkit";

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

export const selectSeasons = (state: RootState) => state.seasons.list;
export const selectSeasonsLoading = (state: RootState) => state.seasons.loading;

export const loadSeasons = createAsyncThunk<ProductSeason[]>(
    'seasons/load',
    async () => {
        return await fetchSeasons();
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectSeasonsLoading(state);
        }
    }
)

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
