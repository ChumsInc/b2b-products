import {defaultProduct} from "../../../defaults";
import {createReducer} from "@reduxjs/toolkit";
import {
    duplicateProduct,
    loadProduct,
    saveProduct,
    setNewProduct,
    updateProduct,
    updateProductAdditionalData
} from "./actions";
import {variantListSorter} from "../sorter";
import {removeVariant, saveCurrentVariant, setDefaultVariant} from "../variant/actions";
import {SortProps} from "chums-components";
import {Editable, ProductVariant} from "b2b-types";
import {Product} from "b2b-types/src/products";
import {isSellAsVariants} from "../../../utils";
import {saveCurrentColorItem} from "../color/actions";

export type EditableProduct = Product & Editable;

export const defaultVariantSorterProps: SortProps<ProductVariant> = {
    field: 'isDefaultVariant',
    ascending: true,
}

export interface CurrentProductState {
    product: EditableProduct | null,
    loading: boolean;
    saving: boolean;
}

export const initialCurrentProductState: CurrentProductState = {
    product: {...defaultProduct},
    loading: false,
    saving: false,
}


const currentProductReducer = createReducer(initialCurrentProductState, (builder) => {
    builder
        .addCase(setNewProduct, (state) => {
            state.product = defaultProduct;
        })
        .addCase(updateProduct, (state, action) => {
            if (state.product) {
                // @ts-ignore
                state.product = {...state.product, ...action.payload, changed: true};
            }
        })
        .addCase(updateProductAdditionalData, (state, action) => {
            if (state.product) {
                if (!state.product.additionalData) {
                    state.product.additionalData = {};
                }
                state.product.additionalData = {...state.product.additionalData, ...action.payload};
                state.product.changed = true;
            }
        })
        .addCase(loadProduct.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadProduct.fulfilled, (state, action) => {
            state.loading = false;
            state.product = action.payload;
        })
        .addCase(loadProduct.rejected, (state) => {
            state.loading = false;
        })
        .addCase(saveProduct.pending, (state) => {
            state.saving = true;
        })
        .addCase(saveProduct.fulfilled, (state, action) => {
            state.saving = false;
            state.product = action.payload;
        })
        .addCase(saveProduct.rejected, (state) => {
            state.saving = false;
        })
        .addCase(saveCurrentVariant.pending, (state) => {
            state.saving = true;
        })
        .addCase(saveCurrentVariant.fulfilled, (state, action) => {
            state.saving = false;
            if (action.payload && state.product && isSellAsVariants(state.product)) {
                state.product.variants = [
                    ...state.product.variants.filter(v => v.id !== action.payload?.id),
                    action.payload,
                ].sort(variantListSorter(defaultVariantSorterProps))
            }
        })
        .addCase(saveCurrentVariant.rejected, (state) => {
            state.saving = false;
        })
        .addCase(duplicateProduct, (state) => {
            if (state.product) {
                state.product.changed = true;
                state.product.id = 0;
                state.product.keyword = '';
            }
        })
        .addCase(removeVariant.pending, (state) => {
            state.saving = true;
        })
        .addCase(removeVariant.fulfilled, (state, action) => {
            if (state.product && isSellAsVariants(state.product)) {
                state.product.variants = action.payload.sort(variantListSorter(defaultVariantSorterProps));
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
            if (state.product && isSellAsVariants(state.product)) {
                state.product.variants = action.payload.sort(variantListSorter(defaultVariantSorterProps));
            }
            state.saving = false;
        })
});

export default currentProductReducer;
