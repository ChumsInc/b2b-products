import {createAsyncThunk} from "@reduxjs/toolkit";
import type {Product} from "b2b-types";
import {generatePath, redirect} from "react-router";
import {fetchProduct, postProduct} from "../api/product-api.ts";
import {type RootState} from "@/app/configureStore.ts";
import {selectCurrentKeyword} from "../productKeywordSlice.ts";
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

export const saveProduct = createAsyncThunk<Product | null, Product>(
    'value/current/save',
    async (arg, {getState}) => {
        const state = getState() as RootState;
        const keyword = selectCurrentKeyword(state);
        const product = await postProduct(arg);
        if (product && product?.keyword !== keyword) {
            redirect(generatePath('/products/:keyword', {keyword: product.keyword}))
            return null;
        }
        return postProduct(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg.keyword && selectCurrentProductStatus(state) === 'idle';
        }
    }
)


