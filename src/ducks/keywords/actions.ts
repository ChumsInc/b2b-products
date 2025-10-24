import {createAsyncThunk} from "@reduxjs/toolkit";
import {type RootState} from "@/app/configureStore";
import {selectKeywordsLoading} from "./selectors";
import {fetchKeywords} from "./api";
import type {Keyword} from "b2b-types";

export const loadKeywords = createAsyncThunk<Keyword[], void, { state: RootState }>(
    'keywords/load',
    async () => {
        return await fetchKeywords({includeInactive: true});
    },
    {
        condition: (_, {getState}) => {
            const state = getState();
            return !selectKeywordsLoading(state);
        }
    }
);
