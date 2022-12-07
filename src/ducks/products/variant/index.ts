import {defaultVariant, ProductVariant} from "b2b-types";
import {createReducer} from "@reduxjs/toolkit";
import {removeVariant, saveCurrentVariant, setCurrentVariant, setDefaultVariant} from "./actions";
import {loadProduct} from "../product/actions";
import {isSellAsVariantsProduct} from "../utils";

export interface CurrentVariantState {
    productId: number | null;
    list: ProductVariant[];
    variant: ProductVariant | null;
    loading: boolean;
    saving: boolean;
}

export const initialVariantState: CurrentVariantState = {
    productId: null,
    list: [],
    variant: {...defaultVariant},
    loading: false,
    saving: false,
}

const currentVariantReducer = createReducer(initialVariantState, (builder) => {
    builder
        .addCase(loadProduct.fulfilled, (state, action) => {
            if (action.payload && isSellAsVariantsProduct(action.payload)) {
                state.list = action.payload.variants ?? [];
                if (state.productId === action.payload.id && !!state.variant?.id) {
                    const [variant] = state.list.filter(item => item.id === state.variant?.id);
                    state.variant = variant ?? null;
                }
            } else {
                state.list = [];
            }
            state.productId = action.payload?.id ?? null;
        })
        .addCase(setCurrentVariant, (state, action) => {
            state.variant = action.payload;
        })
        .addCase(saveCurrentVariant.pending, (state) => {
            state.saving = true;
        })
        .addCase(saveCurrentVariant.fulfilled, (state, action) => {
            state.saving = false;
            state.variant = action.payload;
        })
        .addCase(saveCurrentVariant.rejected, (state) => {
            state.saving = false;
        })
        .addCase(removeVariant.pending, (state) => {
            state.saving = true;
        })
        .addCase(removeVariant.fulfilled, (state) => {
            state.variant = null;
            state.saving = false;
        })
        .addCase(removeVariant.rejected, (state) => {
            state.saving = false;
        })
        .addCase(setDefaultVariant.pending, (state) => {
            state.saving = true;
        })
        .addCase(setDefaultVariant.fulfilled, (state, action) => {
            state.saving = false;
            const [variant] = action.payload.filter(v => v.id === action.meta.arg.id);
            state.variant = variant ?? null;
        })
        .addCase(setDefaultVariant.rejected, (state) => {
            state.saving = false;
        })
});

export default currentVariantReducer;
