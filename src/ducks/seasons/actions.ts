import {createAsyncThunk} from "@reduxjs/toolkit";
import type {ProductSeason} from "b2b-types";
import {fetchSeasons} from "./api";
import {type RootState} from "@/app/configureStore";
import {selectSeasonsStatus} from "@/ducks/seasons";

export const loadSeasons = createAsyncThunk<ProductSeason[]>(
    'seasons/load',
    async () => {
        return await fetchSeasons();
    },
    {
        condition: (_, {getState}) => {
            const state = getState() as RootState;
            return selectSeasonsStatus(state) === 'idle'
        }
    }
)
