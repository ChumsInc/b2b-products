import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {Product, ProductAdditionalData, ProductSeason} from "b2b-types";
import {generatePath, redirect} from "react-router";
import {fetchProduct, postProduct} from "./api";
import {RootState} from "../../../app/configureStore";
import {selectCurrentProductLoading, selectCurrentProductSaving} from "./selectors";
import {selectCurrentKeyword} from "../keyword/selectors";
import {defaultProduct} from "./utils";


export const duplicateProduct = createAction('products/current/duplicate');
export const updateProduct = createAction<Partial<Product>>('products/current/update');
export const updateProductSeason = createAction<Partial<ProductSeason> | null>('products/current/update-season');
export const updateProductAdditionalData = createAction<Partial<ProductAdditionalData>>('products/current/updateAdditionalData');

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
            return !!arg
                && !selectCurrentProductLoading(state)
                && !selectCurrentProductSaving(state);
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
            return !!arg.keyword
                && !selectCurrentProductLoading(state)
                && !selectCurrentProductSaving(state);
        }
    }
)


