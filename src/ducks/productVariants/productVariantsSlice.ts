import {ProductVariant} from "b2b-types";
import {CaseReducer, createEntityAdapter, createSlice, EntityState, PayloadAction} from "@reduxjs/toolkit";
import {removeVariant, saveCurrentVariant, saveVariantsSort, setDefaultVariant} from "./actions";
import {loadProduct} from "../products/product/actions";
import {isSellAsVariantsProduct} from "../products/utils";
import {defaultVariant} from "@/src/utils";
import {variantSortKey} from "./utils";
import {variantListSorter} from "@/ducks/products/sorter";

export interface CurrentVariantState {
    productId: number | null;
    variant: ProductVariant | null;
    currentSort: string;
    status: 'idle' | 'loading' | 'saving' | 'deleting' | 'rejected';
    loading: boolean;
    saving: boolean;
}

export const initialVariantState: CurrentVariantState = {
    productId: null,
    variant: {...defaultVariant},
    currentSort: '',
    status: 'idle',
    loading: false,
    saving: false,
}

const variantsAdapter = createEntityAdapter<ProductVariant, number>({
    selectId: (arg) => arg.id,
    sortComparer: (a, b) => a.id - b.id,
})

const adapterSelectors = variantsAdapter.getSelectors();

const updateCurrentSort:CaseReducer<EntityState<ProductVariant, number> & CurrentVariantState> = (state) => {
    state.currentSort = variantSortKey(adapterSelectors.selectAll(state).sort(variantListSorter({field:"priority", ascending: true})));
}
const variantsSlice = createSlice({
    name: 'productVariants',
    initialState: variantsAdapter.getInitialState(initialVariantState),
    reducers: {
        setCurrentVariant: (state, action: PayloadAction<ProductVariant | null>) => {
            state.variant = action.payload;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(loadProduct.fulfilled, (state, action) => {
                if (action.payload && isSellAsVariantsProduct(action.payload)) {
                    variantsAdapter.setAll(state, action.payload.variants);
                    if (state.productId === action.payload.id && !!state.variant?.id) {
                        state.variant = adapterSelectors.selectById(state, state.variant.id) ?? null
                    } else {
                        state.variant = {...defaultVariant, parentProductID: action.payload.id}
                    }
                } else {
                    variantsAdapter.removeAll(state);
                }
                updateCurrentSort(state, action);
                state.productId = action.payload?.id ?? null;
            })
            .addCase(saveCurrentVariant.pending, (state) => {
                state.status = 'saving';
            })
            .addCase(saveCurrentVariant.fulfilled, (state, action) => {
                state.status = 'idle';
                state.variant = action.payload;
                if (action.payload) {
                    variantsAdapter.setOne(state, action.payload);
                }
                updateCurrentSort(state, action);
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
                variantsAdapter.removeOne(state, action.meta.arg.id)
                updateCurrentSort(state, action);
            })
            .addCase(removeVariant.rejected, (state) => {
                state.status = 'rejected';
            })
            .addCase(setDefaultVariant.pending, (state) => {
                state.status = 'saving';
            })
            .addCase(setDefaultVariant.fulfilled, (state, action) => {
                state.status = 'idle';
                const [variant] = action.payload.filter(v => v.id === action.meta.arg.id);
                state.variant = variant ?? null;
                variantsAdapter.setAll(state, action.payload);
                updateCurrentSort(state, action);
            })
            .addCase(setDefaultVariant.rejected, (state) => {
                state.status = 'rejected';
            })
            .addCase(saveVariantsSort.pending, (state) => {
                state.status = 'saving';
            })
            .addCase(saveVariantsSort.fulfilled, (state, action) => {
                state.status = 'idle';
                variantsAdapter.setAll(state, action.payload);
                updateCurrentSort(state, action);
            })
            .addCase(saveVariantsSort.rejected, (state) => {
                state.status = 'rejected';
            })
    },
    selectors: {
        selectCurrentProductVariants: (state) => adapterSelectors.selectAll(state),
        selectCurrentVariant: (state) => state.variant,
        selectCurrentVariantId: (state) => state.variant?.id ?? null,
        selectCurrentVariantStatus: (state) => state.status,
        selectCurrentVariantSort: (state) => state.currentSort,
    }
})

export const {
    setCurrentVariant
} = variantsSlice.actions;
export const {
    selectCurrentProductVariants,
    selectCurrentVariantStatus,
    selectCurrentVariantSort,
    selectCurrentVariantId,
    selectCurrentVariant
} = variantsSlice.selectors;

export default variantsSlice;

