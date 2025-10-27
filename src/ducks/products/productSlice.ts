import type {CurrentProductState} from "@/ducks/products/types";
import {defaultProduct, defaultProductSeason} from "@/ducks/products/utils/product-utils.ts";
import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {Product, ProductAdditionalData, ProductSeason, ProductVariant} from "b2b-types";
import {loadProduct, saveProduct} from "@/ducks/products/actions/product-actions.ts";
import {removeVariant, saveCurrentVariant, setDefaultVariant} from "@/ducks/products/actions/variants-actions.ts";
import {isSellAsVariants} from "@/src/utils.ts";
import {variantListSorter} from "@/ducks/products/utils/sorter.ts";
import type {SortProps} from "chums-types";

export const defaultVariantSorterProps: SortProps<ProductVariant> = {
    field: 'isDefaultVariant',
    ascending: true,
}

const initialState: CurrentProductState = {
    value: {...defaultProduct},
    status: 'idle',
    loading: false,
    saving: false,
};

const productSlice = createSlice({
    name: 'currentProduct',
    initialState,
    reducers: {
        duplicateProduct: (state) => {
            if (state.value) {
                state.value.changed = true;
                state.value.id = 0;
                state.value.keyword = '';
            }
        },
        updateProduct(state, action: PayloadAction<Partial<Product>>) {
            if (state.value) {
                state.value = {...state.value, ...action.payload, changed: true};
            }
        },
        updateProductSeason(state, action: PayloadAction<Partial<ProductSeason> | null>) {
            if (state.value) {
                if (action.payload) {
                    if (!state.value.season) {
                        state.value.season = {...defaultProductSeason}
                    }
                    state.value.season = {...state.value.season, ...action.payload}
                    state.value.product_season_id = action.payload.product_season_id ?? null;
                } else {
                    state.value.season = null;
                    state.value.product_season_id = null;
                    state.value.season_code = null;
                }
                state.value.season_code = action.payload?.code ?? null;
            }
        },
        updateProductAdditionalData(state, action: PayloadAction<Partial<ProductAdditionalData>>) {
            if (state.value) {
                if (!state.value.additionalData) {
                    state.value.additionalData = {};
                }
                state.value.additionalData = {...state.value.additionalData, ...action.payload};
                state.value.changed = true;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadProduct.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
            })
            .addCase(loadProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.status = 'idle';
                state.value = action.payload;
            })
            .addCase(loadProduct.rejected, (state) => {
                state.loading = false;
                state.status = 'rejected';
            })
            .addCase(saveProduct.pending, (state) => {
                state.saving = true;
                state.status = 'saving';
            })
            .addCase(saveProduct.fulfilled, (state, action) => {
                state.saving = false;
                state.status = 'idle';
                state.value = action.payload;
            })
            .addCase(saveProduct.rejected, (state) => {
                state.saving = false;
                state.status = 'rejected';
            })
            .addCase(saveCurrentVariant.pending, (state) => {
                state.saving = true;
                state.status = 'saving';
            })
            .addCase(saveCurrentVariant.fulfilled, (state, action) => {
                state.saving = false;
                state.status = 'idle';
                if (action.payload && state.value && isSellAsVariants(state.value)) {
                    state.value.variants = [
                        ...state.value.variants.filter(v => v.id !== action.payload?.id),
                        action.payload,
                    ].sort(variantListSorter(defaultVariantSorterProps))
                }
            })
            .addCase(saveCurrentVariant.rejected, (state) => {
                state.saving = false;
                state.status = 'rejected';
            })
            .addCase(removeVariant.pending, (state) => {
                state.saving = true;
                state.status = 'saving';
            })
            .addCase(removeVariant.fulfilled, (state, action) => {
                if (state.value && isSellAsVariants(state.value)) {
                    state.value.variants = action.payload.sort(variantListSorter(defaultVariantSorterProps));
                }
                state.saving = false;
                state.status = 'idle';
            })
            .addCase(removeVariant.rejected, (state) => {
                state.saving = false;
                state.status = 'rejected';
            })
            .addCase(setDefaultVariant.pending, (state) => {
                state.saving = true;
                state.status = 'saving';
            })
            .addCase(setDefaultVariant.fulfilled, (state, action) => {
                if (state.value && isSellAsVariants(state.value)) {
                    state.value.variants = action.payload.sort(variantListSorter(defaultVariantSorterProps));
                }
                state.saving = false;
                state.status = 'idle';
            })
            .addCase(setDefaultVariant.rejected, (state) => {
                state.saving = false;
                state.status = 'rejected';
            })
    },
    selectors: {
        selectCurrentProduct: (state) => state.value,
        selectCurrentProductId: (state) => state.value?.id ?? 0,
        selectCurrentProductKeyword: (state) => state.value?.keyword ?? '',
        selectCurrentProductStatus: (state) => state.status,
        selectCurrentProductSellAs: (state) => state.value?.sellAs ?? null,
        selectCurrentProductChanged: (state) => state.value?.changed ?? false,
        selectCurrentProductLoading: (state) => state.loading,
        selectCurrentProductSaving: (state) => state.saving,
    }
});

export default productSlice;
export const {
    duplicateProduct,
    updateProduct,
    updateProductSeason,
    updateProductAdditionalData
} = productSlice.actions;
export const {
    selectCurrentProduct,
    selectCurrentProductId,
    selectCurrentProductKeyword,
    selectCurrentProductStatus,
    selectCurrentProductSellAs,
    selectCurrentProductChanged,
    selectCurrentProductLoading,
    selectCurrentProductSaving
} = productSlice.selectors;
