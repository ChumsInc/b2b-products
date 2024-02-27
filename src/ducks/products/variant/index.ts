import {ProductVariant} from "b2b-types";
import {createReducer} from "@reduxjs/toolkit";
import {removeVariant, saveCurrentVariant, saveVariantsSort, setCurrentVariant, setDefaultVariant} from "./actions";
import {loadProduct} from "../product/actions";
import {isSellAsVariantsProduct} from "../utils";
import {variantListSorter} from "../sorter";
import {SortProps} from "chums-components";
import {defaultVariant} from "../../../utils";
import {variantSortKey} from "./utils";

export const defaultVariantSort:SortProps<ProductVariant> = {
    field: "priority",
    ascending: true,
}

export interface CurrentVariantState {
    productId: number | null;
    list: ProductVariant[];
    variant: ProductVariant | null;
    currentSort: string;
    loading: boolean;
    saving: boolean;
}

export const initialVariantState: CurrentVariantState = {
    productId: null,
    list: [],
    variant: {...defaultVariant},
    currentSort: '',
    loading: false,
    saving: false,
}

const currentVariantReducer = createReducer(initialVariantState, (builder) => {
    builder
        .addCase(loadProduct.fulfilled, (state, action) => {
            if (action.payload && isSellAsVariantsProduct(action.payload)) {
                state.list = [...action.payload.variants].sort(variantListSorter(defaultVariantSort));
                if (state.productId === action.payload.id && !!state.variant?.id) {
                    const [variant] = state.list.filter(item => item.id === state.variant?.id);
                    state.variant = variant ?? null;
                } else {
                    state.variant = {...defaultVariant, parentProductID: action.payload.id}
                }

            } else {
                state.list = [];
            }
            state.currentSort = variantSortKey(state.list);
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
            if (action.payload) {
                state.list = [
                    ...state.list.filter(v => v.id !== action.payload?.id),
                    action.payload,
                ].sort(variantListSorter(defaultVariantSort));
                state.currentSort = variantSortKey(state.list);
            }
        })
        .addCase(saveCurrentVariant.rejected, (state) => {
            state.saving = false;
        })
        .addCase(removeVariant.pending, (state) => {
            state.saving = true;
        })
        .addCase(removeVariant.fulfilled, (state, action) => {
            state.variant = null;
            state.saving = false;
            state.list = [...action.payload].sort(variantListSorter(defaultVariantSort))
            state.currentSort = variantSortKey(state.list);
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
            state.list = [...action.payload].sort(variantListSorter(defaultVariantSort))
            state.currentSort = variantSortKey(state.list);
        })
        .addCase(setDefaultVariant.rejected, (state) => {
            state.saving = false;
        })
        .addCase(saveVariantsSort.pending, (state) => {
            state.saving = true;
        })
        .addCase(saveVariantsSort.fulfilled, (state, action) => {
            state.saving = false;
            state.list = [...action.payload].sort(variantListSorter(defaultVariantSort));
            state.currentSort = variantSortKey(state.list);
        })
        .addCase(saveVariantsSort.rejected, (state) => {
            state.saving = false;
        })
});

export default currentVariantReducer;

