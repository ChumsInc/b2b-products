import {createAsyncThunk} from "@reduxjs/toolkit";
import {ItemSearchRecord} from "chums-components";
import {ItemSearchFilter} from "../../types/item-search";
import {loadItemSearchAPI} from "./api";

export const loadItemSearch = createAsyncThunk<ItemSearchRecord[], { search: string, filter?: ItemSearchFilter, signal?: AbortSignal }>(
    'item-search/load',
    async (arg) => {
        return await loadItemSearchAPI(arg.search, arg.filter, arg.signal);
    },
    {
        condition: (arg) => !!arg.search
    }
)
