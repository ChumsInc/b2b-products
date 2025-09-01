import {createAsyncThunk} from "@reduxjs/toolkit";
import type {ProductVariant} from "b2b-types";
import {deleteVariant, postVariant, putDefaultVariant, putVariantSort} from "./api";
import {selectCurrentVariantStatus} from "./productVariantsSlice";
import {type RootState} from "@/app/configureStore";
import {selectCurrentProductLoading} from "../products/product/selectors";
import type {VariantSortArgs} from "@/types/variant";

export const saveCurrentVariant = createAsyncThunk<ProductVariant | null, ProductVariant>(
    'products/current/productVariants/save',
    async (arg) => {
        return await postVariant(arg);
    },
    {
        condition: (_, {getState}) => {
            const state = getState() as RootState;
            return selectCurrentVariantStatus(state) === 'idle'
                && !selectCurrentProductLoading(state);
        }
    }
)

export const removeVariant = createAsyncThunk<ProductVariant[], ProductVariant>(
    'products/current/removeVariant',
    async (arg) => {
        return deleteVariant(arg);
    },
    {
        condition: (_, {getState}) => {
            const state = getState() as RootState;
            return selectCurrentVariantStatus(state) === 'idle'
                && !selectCurrentProductLoading(state);
        }
    }
)

export const setDefaultVariant = createAsyncThunk<ProductVariant[], ProductVariant>(
    'products/current/setDefaultVariant',
    async (arg) => {
        return putDefaultVariant(arg);
    },
    {
        condition: (_, {getState}) => {
            const state = getState() as RootState;
            return selectCurrentVariantStatus(state) === 'idle'
                && !selectCurrentProductLoading(state);
        }
    }
)

export const saveVariantsSort = createAsyncThunk<ProductVariant[], VariantSortArgs[]>(
    'products/current/saveVariantsSort',
    async (arg) => {
        return putVariantSort(arg);
    },
    {
        condition: (_, {getState}) => {
            const state = getState() as RootState;
            return selectCurrentVariantStatus(state) === 'idle'
                && !selectCurrentProductLoading(state);
        }
    }
)
