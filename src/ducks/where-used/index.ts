import {createReducer} from "@reduxjs/toolkit";
import {loadWhereUsed} from "./actions";
import {wuKeywordSorter} from "./utils";
import {WhereUsed} from "./types";


export interface WhereUsedState {
    products: WhereUsed[];
    categories: WhereUsed[];
    search: string;
    loading: boolean;
}

export const initialState: WhereUsedState = {
    products: [],
    categories: [],
    search: '',
    loading: false,
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
