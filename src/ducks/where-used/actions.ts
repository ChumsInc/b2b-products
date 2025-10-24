import {createAsyncThunk} from "@reduxjs/toolkit";
import {fetchWhereUsed} from "./api";
import {type RootState} from "@/app/configureStore";
import type {WhereUsedResponse} from "./types";
import {selectWhereUsedLoading} from "./selectors";

export const loadWhereUsed = createAsyncThunk<WhereUsedResponse, string>(
    'where-used/load',
    async (arg) => {
        return await fetchWhereUsed(arg);
    },
    {
        condition: (_, {getState}) => {
            const state = getState() as RootState;
            return !selectWhereUsedLoading(state);
        }
    }
)
