import {ProductSeason} from "b2b-types";
import {createEntityAdapter, createSelector, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {loadSeasons} from "./actions";
import {SortProps} from "chums-types";
import {dismissAlert} from "@/ducks/alerts";
import {RootState} from "@/app/configureStore";


const seasonsAdapter = createEntityAdapter<ProductSeason, number>({
    selectId: (season) => season.product_season_id,
    sortComparer: (a, b) => a.product_season_id - b.product_season_id,
});

interface SeasonsSliceExtraSate {
    status: 'idle' | 'loading' | 'saving' | 'rejected';
    sort: SortProps<ProductSeason>;
}

const extraSates: SeasonsSliceExtraSate = {
    status: 'idle',
    sort: {field: 'code', ascending: true},
}

const seasonsSlice = createSlice({
    name: 'seasons',
    initialState: seasonsAdapter.getInitialState(extraSates),
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
                seasonsAdapter.setAll(state, action.payload);
            })
            .addCase(loadSeasons.rejected, (state) => {
                state.status = 'rejected';
            })
            .addCase(dismissAlert, (state, action) => {
                if (action.payload.context === loadSeasons.typePrefix) {
                    state.status = 'idle';
                }
            })
    },
    selectors: {
        selectSeasonsStatus: (state) => state.status,
        selectSeasonsSort: (state) => state.sort,
    }
})

const seasonsSelectors = seasonsAdapter.getSelectors<RootState>(
    (state) => state.seasons
)
export const selectSeasonsList = seasonsSelectors.selectAll;
export const selectSeasonById = seasonsSelectors.selectById;
export const selectSeasonByCode = createSelector(
    [selectSeasonsList, (state, code: string) => code],
    (list, code) => {
        const [season] = list.filter(season => season.code === code);
        return season ?? null;
    }
)

export const {selectSeasonsStatus, selectSeasonsSort} = seasonsSlice.selectors;

export default seasonsSlice;
