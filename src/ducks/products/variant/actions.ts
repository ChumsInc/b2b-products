import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {ProductVariant} from "b2b-types";
import {deleteVariant, postVariant, putVariantSort, putDefaultVariant} from "../../../api/productsAPI";


export const setCurrentVariant = createAction<ProductVariant|null>('products/current/variant/set');

export const saveCurrentVariant = createAsyncThunk<ProductVariant|null, ProductVariant>(
    'products/current/variant/save',
    async (arg) => {
        return await postVariant(arg);
    }
)

export const removeVariant = createAsyncThunk<ProductVariant[], ProductVariant>(
    'products/current/removeVariant',
    async (arg) => {
        return deleteVariant(arg);
    }
)

export const setDefaultVariant = createAsyncThunk<ProductVariant[], ProductVariant>(
    'products/current/setDefaultVariant',
    async (arg) => {
        return putDefaultVariant(arg);
    }
)

export const saveVariantsSort = createAsyncThunk<ProductVariant[], ProductVariant[]>(
    'products/current/saveVariantsSort',
    async (arg) => {
        return putVariantSort(arg);
    }
)
