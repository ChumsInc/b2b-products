import type {ProductVariant} from "b2b-types";
import {defaultVariant} from "@/src/utils.ts";
import {createEntityAdapter, createSelector, createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {loadProduct} from "@/ducks/products/actions/product-actions.ts";
import {isSellAsVariantsProduct} from "@/ducks/products/utils/utils.ts";
import {getCurrentSort} from "@/ducks/products/utils/variants-utils.ts";
import {
    removeVariant,
    saveCurrentVariant,
    saveVariantsSort,
    setDefaultVariant
} from "@/ducks/products/actions/variants-actions.ts";
import {dismissAlert} from "@/ducks/alerts";
import {variantListSorter} from "@/ducks/products/utils/sorter.ts";

export interface CurrentVariantState {
    productId: number | null;
    variant: ProductVariant | null;
    currentSort: string;
    status: 'idle' | 'loading' | 'saving' | 'deleting' | 'rejected';
    loading: boolean;
    saving: boolean;
}

export const extraState: CurrentVariantState = {
    productId: null,
    variant: {...defaultVariant},
    currentSort: '',
    status: 'idle',
    loading: false,
    saving: false,
}

const adapter = createEntityAdapter<ProductVariant, number>({
    selectId: (arg) => arg.id,
    sortComparer: (a, b) => a.id - b.id,
})

const selectors = adapter.getSelectors();


export const productVariantsSlice = createSlice({
    name: 'productVariants',
    initialState: adapter.getInitialState(extraState),
    reducers: {
        setCurrentVariant: (state, action: PayloadAction<ProductVariant | null>) => {
            state.variant = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadProduct.fulfilled, (state, action) => {
                if (isSellAsVariantsProduct(action.payload)) {
                    adapter.setAll(state, action.payload.variants);
                    if (state.productId === action.payload.id && !!state.variant?.id) {
                        state.variant = action.payload.variants.find(v => v.id === state.variant?.id) ?? null;
                    } else {
                        state.variant = {...defaultVariant, parentProductID: action.payload.id}
                    }
                } else {
                    adapter.removeAll(state);
                }
                state.currentSort = getCurrentSort(state.entities);
                state.productId = action.payload?.id ?? null;
            })
            .addCase(saveCurrentVariant.pending, (state) => {
                state.status = 'saving';
            })
            .addCase(saveCurrentVariant.fulfilled, (state, action) => {
                state.status = 'idle';
                state.variant = action.payload;
                if (action.payload) {
                    adapter.upsertOne(state, action.payload);
                } else {
                    adapter.removeOne(state, action.meta.arg.id)
                }
                state.currentSort = getCurrentSort(state.entities);
            })
            .addCase(saveCurrentVariant.rejected, (state) => {
                state.status = 'rejected';
            })
            .addCase(removeVariant.pending, (state) => {
                state.status = 'deleting';
            })
            .addCase(removeVariant.fulfilled, (state, action) => {
                state.variant = null;
                state.status = 'idle';
                adapter.removeOne(state, action.meta.arg.id)
                state.currentSort = getCurrentSort(state.entities);
            })
            .addCase(removeVariant.rejected, (state) => {
                state.status = 'rejected';
            })
            .addCase(setDefaultVariant.pending, (state) => {
                state.status = 'saving';
            })
            .addCase(setDefaultVariant.fulfilled, (state, action) => {
                state.status = 'idle';
                adapter.setAll(state, action.payload);
                state.variant = action.payload.find(v => v.id === action.meta.arg.id) ?? null;
                state.currentSort = getCurrentSort(state.entities);
            })
            .addCase(setDefaultVariant.rejected, (state) => {
                state.status = 'rejected';
            })
            .addCase(saveVariantsSort.pending, (state) => {
                state.status = 'saving';
            })
            .addCase(saveVariantsSort.fulfilled, (state, action) => {
                state.status = 'idle';
                adapter.setAll(state, action.payload);
                state.currentSort = getCurrentSort(state.entities);
            })
            .addCase(saveVariantsSort.rejected, (state) => {
                state.status = 'rejected';
            })
            .addCase(dismissAlert, (state, action) => {
                if (action.payload.context && [
                    saveCurrentVariant.typePrefix,
                    removeVariant.typePrefix,
                    setDefaultVariant.typePrefix,
                    saveCurrentVariant.typePrefix
                ].includes(action.payload.context)) {
                    state.status = 'idle';
                }
            })
    },
    selectors: {
        selectCurrentProductVariants: (state) => selectors.selectAll(state),
        selectCurrentVariant: (state) => state.variant,
        selectCurrentVariantId: (state) => state.variant?.id ?? null,
        selectCurrentVariantStatus: (state) => state.status,
        selectCurrentVariantSort: (state) => state.currentSort,
    }
});

export const {setCurrentVariant} = productVariantsSlice.actions;
export const {
    selectCurrentProductVariants,
    selectCurrentVariantSort,
    selectCurrentVariantStatus,
    selectCurrentVariantId,
    selectCurrentVariant
} = productVariantsSlice.selectors;

export const selectSortedVariants = createSelector(
    [selectCurrentProductVariants],
    (variants) => {
        return [...variants].sort(variantListSorter({field: 'priority', ascending: true}))
    }
)
