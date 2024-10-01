import {createAsyncThunk} from "@reduxjs/toolkit";
import {ProductSeason} from "b2b-types";
import {fetchSeasons} from "./api";
import {RootState} from "../../app/configureStore";
import {selectSeasonsLoading} from "./selectors";

export const loadSeasons = createAsyncThunk<ProductSeason[]>(
    'seasons/load',
    async () => {
        return await fetchSeasons();
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectSeasonsLoading(state);
        }
    }
)
