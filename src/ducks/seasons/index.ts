import type {ProductSeason} from "b2b-types";
import {createEntityAdapter, createSelector, createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {loadSeasons} from "./actions";
import type {SortProps} from "chums-types";

const adapter = createEntityAdapter<ProductSeason, number>({
    selectId: (arg) => arg.product_season_id,
    sortComparer: (a, b) => a.product_season_id - b.product_season_id,
})

const selectors = adapter.getSelectors();

const extraState: SeasonsState = {
    status: 'idle',
    sort: {field: 'code', ascending: true},
}

const seasonsSlice = createSlice({
    name: 'seasons',
    initialState: adapter.getInitialState(extraState),
    reducers: {
        setSeasonsSort: (state, action: PayloadAction<SortProps<ProductSeason>>) => {
            state.sort = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadSeasons.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loadSeasons.fulfilled, (state, action) => {
                state.status = 'idle';
                adapter.setAll(state, action.payload);
            })
            .addCase(loadSeasons.rejected, (state) => {
                state.status = 'rejected';
            })
    },
    selectors: {
        selectSeasonsStatus: (state) => state.status,
        selectSeasonsList: (state) => selectors.selectAll(state),
        selectSeasonsSort: (state) => state.sort,
    }
});

export default seasonsSlice;
export const {setSeasonsSort} = seasonsSlice.actions;
export const {selectSeasonsStatus, selectSeasonsList, selectSeasonsSort} = seasonsSlice.selectors;

export const selectSeasonByCode = createSelector(
    [selectSeasonsList, (_, code: string) => code],
    (list, code): ProductSeason | null => {
        const season = list.find(season => season.code === code);
        return season ?? null;
    }
)

export const selectSortedSeasons = createSelector(
    [selectSeasonsList],
    (list) => {
        return [...list].sort((a, b) => a.code.toLowerCase().localeCompare(b.code.toLowerCase()))
    }
)


export interface SeasonsState {
    status: 'idle' | 'loading' | 'saving' | 'rejected';
    sort: SortProps<ProductSeason>;
}
