import {createAsyncThunk} from "@reduxjs/toolkit";
import {ProductMixComponent, ProductMixItem} from "b2b-types";
import {postMix, postMixComponent} from "../../../api/productsAPI";


export const saveMix = createAsyncThunk<ProductMixItem, ProductMixItem>(
    'product/current/mix/save',
    async (arg) => {
        return await postMix(arg);
    }
);

export const saveMixComponent = createAsyncThunk<ProductMixItem, { productId: number, component: ProductMixComponent }>(
    'product/current/mix/saveComponent',
    async (arg,) => {
        return await postMixComponent(arg.productId, arg.component);
    }
);

