import {createAsyncThunk} from "@reduxjs/toolkit";
import {RootState} from "../../app/configureStore";
import {selectKeywordsLoading} from "./selectors";
import {fetchKeywords} from "./api";
import {Keyword} from "b2b-types";

export const loadKeywords = createAsyncThunk<Keyword[], void, { state: RootState }>(
    'keywords/load',
    async () => {
        return await fetchKeywords();
    },
    {
        condition: (arg, {getState}) => {
            const state = getState();
            return !selectKeywordsLoading(state);
        }
    }
);
