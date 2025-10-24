import {createAsyncThunk} from "@reduxjs/toolkit";
import type {ProductMixComponent, ProductMixItem} from "b2b-types";
import {fetchMixBOM, postMix, postMixComponent} from "../api/mix-api.ts";
import type {BOMResult} from "@/types/item-search.ts";
import type {RootState} from "@/app/configureStore.ts";
import {selectCurrentMixBOMStatus} from "../productMixBOMSlice";
import {selectCurrentMixStatus} from "@/ducks/products/productMixSlice.ts";


export const saveMix = createAsyncThunk<ProductMixItem|null, ProductMixItem>(
    'value/current/mix/save',
    async (arg) => {
        return await postMix(arg);
    },
    {
        condition: (_, {getState}) => {
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
        condition: (_, {getState}) => {
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
        condition: (_, {getState}) => {
            const state = getState() as RootState;
            return selectCurrentMixBOMStatus(state) === 'idle';
        }
    }
)
