import {createAsyncThunk} from "@reduxjs/toolkit";
import {ProductMixComponent, ProductMixItem} from "b2b-types";
import {fetchMixBOM, postMix, postMixComponent} from "./api";
import {BOMResult} from "../../../types/item-search";
import {RootState} from "../../../app/configureStore";
import {selectCurrentMixBOMStatus, selectCurrentMixStatus} from "./selectors";


export const saveMix = createAsyncThunk<ProductMixItem|null, ProductMixItem>(
    'value/current/mix/save',
    async (arg) => {
        return await postMix(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return selectCurrentMixStatus(state) === 'idle';
        }
    }
);

export const saveMixComponent = createAsyncThunk<ProductMixItem|null, { productId: number, component: ProductMixComponent }>(
    'value/current/mix/saveComponent',
    async (arg,) => {
        return await postMixComponent(arg.productId, arg.component);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return selectCurrentMixStatus(state) === 'idle';
        }
    }
);

export const loadMixBOM = createAsyncThunk<BOMResult|null, string>(
    'value/current/mix/bom',
    async (arg) => {
        return await fetchMixBOM(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return selectCurrentMixBOMStatus(state) === 'idle';
        }
    }
)
