import {RootState} from "../../app/configureStore";
import {loadItemSearchAPI} from "../../api/item-searchAPI";
import {ItemSearchFilter, ItemSearchList} from "../../types/item-search";
import {createAsyncThunk, createReducer} from "@reduxjs/toolkit";
import {ItemSearchRecord} from "chums-components";

export interface ItemSearchState {
    list: ItemSearchList;
    loading: boolean;
}

export const initialItemSearchState: ItemSearchState = {
    list: {},
    loading: false,
}


export const selectItemSearchList = (state: RootState): ItemSearchList => state.itemSearch.list;
export const selectItemSearchLoading = (state: RootState): boolean => state.itemSearch.loading;

export const itemSearch = createAsyncThunk<ItemSearchRecord[], { search: string, filter?: ItemSearchFilter, signal?: AbortSignal }>(
    'item-search/load',
    async (arg) => {
        return await loadItemSearchAPI(arg.search, arg.filter, arg.signal);
    },
    {
        condition: (arg) => !!arg.search
    }
)


const itemSearchReducer = createReducer(initialItemSearchState, (builder) => {
    builder
        .addCase(itemSearch.pending, (state) => {
            state.loading = true;
        })
        .addCase(itemSearch.fulfilled, (state, action) => {
            state.list = {};
            action.payload.forEach(item => {
                state.list[item.ItemCode] = {...item, LabelKey: `${item.ItemCode} - ${item.ItemCodeDesc}`};
            })
            state.loading = false;
        })
        .addCase(itemSearch.rejected, (state) => {
            state.loading = false;
        })
});

export default itemSearchReducer;
