import {createAsyncThunk} from "@reduxjs/toolkit";
import type {Product} from "b2b-types";
import {fetchProduct, postProduct} from "../api/product-api.ts";
import {type RootState} from "@/app/configureStore.ts";
import {defaultProduct} from "../utils/product-utils.ts";
import {selectCurrentProductStatus} from "@/ducks/products/productSlice.ts";

export const loadProduct = createAsyncThunk<Product | null, string>(
    'value/current/load',
    async (arg) => {
        if (arg === 'new') {
            return {...defaultProduct};
        }
        return fetchProduct(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg && selectCurrentProductStatus(state) === 'idle';
        }
    }
)

export const saveProduct = createAsyncThunk<Product | null, Product, { state: RootState }>(
    'value/current/save',
    async (arg) => {
        return await postProduct(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState();
            return !!arg.keyword && selectCurrentProductStatus(state) === 'idle';
        }
    }
)


