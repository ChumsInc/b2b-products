import {defaultProduct, defaultProductSeason} from "./utils";
import {createReducer} from "@reduxjs/toolkit";
import {
    duplicateProduct,
    loadProduct,
    saveProduct,
    updateProduct,
    updateProductAdditionalData,
    updateProductSeason
} from "./actions";
import {variantListSorter} from "../sorter";
import {removeVariant, saveCurrentVariant, setDefaultVariant} from "../variant/actions";
import {SortProps} from "chums-types";
import {Editable, ProductVariant} from "b2b-types";
import {Product} from "b2b-types/src/products";
import {isSellAsVariants} from "@/src/utils";


export type EditableProduct = Product & Editable;

export const defaultVariantSorterProps: SortProps<ProductVariant> = {
    field: 'isDefaultVariant',
    ascending: true,
}

export interface CurrentProductState {
    value: EditableProduct | null,
    loading: boolean;
    saving: boolean;
}

export const initialCurrentProductState: CurrentProductState = {
    value: {...defaultProduct},
    loading: false,
    saving: false,
}


const currentProductReducer = createReducer(initialCurrentProductState, (builder) => {
    builder
        .addCase(updateProduct, (state, action) => {
            if (state.value) {
                state.value = {...state.value, ...action.payload, changed: true};
            }
        })
        .addCase(updateProductSeason, (state, action) => {
            if (state.value) {
                if (action.payload) {
                    if (!state.value.season) {
                        state.value.season = {...defaultProductSeason}
                    }
                    state.value.season = {...state.value.season, ...action.payload}
                } else {
                    state.value.season = null;
                }
                state.value.season_code = action.payload?.code ?? null;
            }
        })
        .addCase(updateProductAdditionalData, (state, action) => {
            if (state.value) {
                if (!state.value.additionalData) {
                    state.value.additionalData = {};
                }
                state.value.additionalData = {...state.value.additionalData, ...action.payload};
                state.value.changed = true;
            }
        })
        .addCase(loadProduct.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadProduct.fulfilled, (state, action) => {
            state.loading = false;
            state.value = action.payload;
        })
        .addCase(loadProduct.rejected, (state) => {
            state.loading = false;
        })
        .addCase(saveProduct.pending, (state) => {
            state.saving = true;
        })
        .addCase(saveProduct.fulfilled, (state, action) => {
            state.saving = false;
            state.value = action.payload;
        })
        .addCase(saveProduct.rejected, (state) => {
            state.saving = false;
        })
        .addCase(saveCurrentVariant.pending, (state) => {
            state.saving = true;
        })
        .addCase(saveCurrentVariant.fulfilled, (state, action) => {
            state.saving = false;
            if (action.payload && state.value && isSellAsVariants(state.value)) {
                state.value.variants = [
                    ...state.value.variants.filter(v => v.id !== action.payload?.id),
                    action.payload,
                ].sort(variantListSorter(defaultVariantSorterProps))
            }
        })
        .addCase(saveCurrentVariant.rejected, (state) => {
            state.saving = false;
        })
        .addCase(duplicateProduct, (state) => {
            if (state.value) {
                state.value.changed = true;
                state.value.id = 0;
                state.value.keyword = '';
            }
        })
        .addCase(removeVariant.pending, (state) => {
            state.saving = true;
        })
        .addCase(removeVariant.fulfilled, (state, action) => {
            if (state.value && isSellAsVariants(state.value)) {
                state.value.variants = action.payload.sort(variantListSorter(defaultVariantSorterProps));
            }
            state.saving = false;
        })
        .addCase(removeVariant.rejected, (state) => {
            state.saving = false;
        })
        .addCase(setDefaultVariant.pending, (state) => {
            state.saving = true;
        })
        .addCase(setDefaultVariant.fulfilled, (state, action) => {
            if (state.value && isSellAsVariants(state.value)) {
                state.value.variants = action.payload.sort(variantListSorter(defaultVariantSorterProps));
            }
            state.saving = false;
        })
});

export default currentProductReducer;
