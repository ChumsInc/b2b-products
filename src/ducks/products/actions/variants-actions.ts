import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import type {ProductVariant} from "b2b-types";
import {deleteVariant, postVariant, putDefaultVariant, putVariantSort} from "../api/variants-api.ts";
import {selectCurrentVariantStatus} from "@/ducks/products/productVariantsSlice";
import {type RootState} from "@/app/configureStore.ts";
import type {VariantSortArgs} from "@/types/variant.ts";
import {selectCurrentProductStatus} from "@/ducks/products/productSlice.ts";

export const setCurrentVariant = createAction<ProductVariant | null>('productVariants/setCurrent');

export const saveCurrentVariant = createAsyncThunk<ProductVariant | null, ProductVariant>(
    'productVariants/save',
    async (arg) => {
        return await postVariant(arg);
    },
    {
        condition: (_, {getState}) => {
            const state = getState() as RootState;
            return selectCurrentVariantStatus(state) === 'idle'
                && selectCurrentProductStatus(state) === 'idle';
        }
    }
)

export const removeVariant = createAsyncThunk<ProductVariant[], ProductVariant>(
    'productVariants/removeVariant',
    async (arg) => {
        return deleteVariant(arg);
    },
    {
        condition: (_, {getState}) => {
            const state = getState() as RootState;
            return selectCurrentVariantStatus(state) === 'idle'
                && selectCurrentProductStatus(state) === 'idle';
        }
    }
)

export const setDefaultVariant = createAsyncThunk<ProductVariant[], ProductVariant>(
    'productVariants/setDefaultVariant',
    async (arg) => {
        return putDefaultVariant(arg);
    },
    {
        condition: (_, {getState}) => {
            const state = getState() as RootState;
            return selectCurrentVariantStatus(state) === 'idle'
                && selectCurrentProductStatus(state) === 'idle';
        }
    }
)

export const saveVariantsSort = createAsyncThunk<ProductVariant[], VariantSortArgs[]>(
    'productVariants/saveVariantsSort',
    async (arg) => {
        return putVariantSort(arg);
    },
    {
        condition: (_, {getState}) => {
            const state = getState() as RootState;
            return selectCurrentVariantStatus(state) === 'idle'
                && selectCurrentProductStatus(state) === 'idle';
        }
    }
)
