import {createAsyncThunk} from "@reduxjs/toolkit";
import {ProductSeason} from "b2b-types";
import {fetchSeasons} from "./api";
import {RootState} from "@/app/configureStore";
import {selectSeasonsStatus} from "@/ducks/seasons/index";

export const loadSeasons = createAsyncThunk<ProductSeason[]>(
    'seasons/load',
    async () => {
        return await fetchSeasons();
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return selectSeasonsStatus(state) === 'idle'
        }
    }
)
