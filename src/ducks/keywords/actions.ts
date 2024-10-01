import {createAsyncThunk} from "@reduxjs/toolkit";
import {RootState} from "../../app/configureStore";
import {selectKeywordsLoading} from "./selectors";
import {fetchKeywords} from "./api";

export const loadKeywords = createAsyncThunk(
    'keywords/load',
    async () => {
        return await fetchKeywords();
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectKeywordsLoading(state);
        }
    }
);
