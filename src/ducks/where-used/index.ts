import {createAsyncThunk, createReducer} from "@reduxjs/toolkit";
import {RootState} from "../../app/configureStore";
import {fetchWhereUsed} from "../../api/where-used";

export interface WhereUsed {
    id: number;
    keyword: string;
    active: boolean;
}

export interface WhereUsedResponse {
    products?: WhereUsed[];
    categoryPages?: WhereUsed[];
}


export interface WhereUsedState {
    products:WhereUsed[];
    categories: WhereUsed[];
    search: string;
    loading: boolean;
}

export const initialState:WhereUsedState = {
    products: [],
    categories: [],
    search: '',
    loading: false,
}

export const selectWhereUsedProducts = (state:RootState) => state.whereUsed.products;
export const selectWhereUsedCategories = (state:RootState) => state.whereUsed.categories;
export const selectWhereUsedSearch = (state:RootState) => state.whereUsed.search;
export const selectWhereUsedLoading = (state:RootState) => state.whereUsed.loading;

export const loadWhereUsed = createAsyncThunk<WhereUsedResponse, string>(
    'where-used/load',
    async (arg) => {
        return await fetchWhereUsed(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectWhereUsedLoading(state);
        }
    }
)

export const wuKeywordSorter = (a:WhereUsed, b:WhereUsed):number => {
    return a.keyword === b.keyword
        ? (a.id - b.id)
        : (a.keyword > b.keyword ? 1 : -1)
}

const whereUsedReducer = createReducer(initialState, builder => {
    builder
        .addCase(loadWhereUsed.pending, (state, action) => {
            state.loading = true;
            state.search = action.meta.arg;
        })
        .addCase(loadWhereUsed.fulfilled, (state, action) => {
            state.products = (action.payload.products ?? []).sort(wuKeywordSorter);
            state.categories = (action.payload.categoryPages ?? []).sort(wuKeywordSorter);
            state.loading = false;
        })
        .addCase(loadWhereUsed.rejected, (state) => {
            state.loading = false;
        })
});

export default whereUsedReducer;
