import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {ProductVariant} from "b2b-types";
import {deleteVariant, postVariant, putVariantSort, putDefaultVariant} from "../../../api/productsAPI";
import {selectCurrentVariantSaving} from "./selectors";
import {RootState} from "../../../app/configureStore";
import {selectCurrentProductLoading} from "../product/selectors";
import {VariantSortArgs} from "../../../types/variant";


export const setCurrentVariant = createAction<ProductVariant|null>('products/current/variant/set');

export const saveCurrentVariant = createAsyncThunk<ProductVariant|null, ProductVariant>(
    'products/current/variant/save',
    async (arg) => {
        return await postVariant(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !(selectCurrentProductLoading(state) || selectCurrentVariantSaving(state));
        }
    }
)

export const removeVariant = createAsyncThunk<ProductVariant[], ProductVariant>(
    'products/current/removeVariant',
    async (arg) => {
        return deleteVariant(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !(selectCurrentProductLoading(state) || selectCurrentVariantSaving(state));
        }
    }
)

export const setDefaultVariant = createAsyncThunk<ProductVariant[], ProductVariant>(
    'products/current/setDefaultVariant',
    async (arg) => {
        return putDefaultVariant(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !(selectCurrentProductLoading(state) || selectCurrentVariantSaving(state));
        }
    }
)

export const saveVariantsSort = createAsyncThunk<ProductVariant[], VariantSortArgs[]>(
    'products/current/saveVariantsSort',
    async (arg) => {
        return putVariantSort(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !(selectCurrentProductLoading(state) || selectCurrentVariantSaving(state));
        }
    }
)
