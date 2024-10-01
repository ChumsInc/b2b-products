import {ItemSearchList} from "../../types/item-search";
import {createReducer} from "@reduxjs/toolkit";
import {loadItemSearch} from "./actions";

export interface ItemSearchState {
    list: ItemSearchList;
    loading: boolean;
}

export const initialItemSearchState: ItemSearchState = {
    list: {},
    loading: false,
}


const itemSearchReducer = createReducer(initialItemSearchState, (builder) => {
    builder
        .addCase(loadItemSearch.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadItemSearch.fulfilled, (state, action) => {
            state.list = {};
            action.payload.forEach(item => {
                state.list[item.ItemCode] = {...item, LabelKey: `${item.ItemCode} - ${item.ItemCodeDesc}`};
            })
            state.loading = false;
        })
        .addCase(loadItemSearch.rejected, (state) => {
            state.loading = false;
        })
});

export default itemSearchReducer;
