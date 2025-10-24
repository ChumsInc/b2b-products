import type {ActionStatus, ProductColorItem} from "b2b-types";
import type {SortProps} from "chums-types";
import {createEntityAdapter, createSelector, createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {removeColorItem, saveCurrentColorItem} from "@/ducks/products/actions/color-item-actions.ts";
import {loadProduct} from "@/ducks/products/actions/product-actions.ts";
import {isSellAsColorsProduct} from "@/ducks/products/utils/utils.ts";
import {dismissAlert} from "@/ducks/alerts";
import {productColorSorter} from "@/ducks/products/utils/color-item-utils.ts";

export interface ProductColorItemsState {
    productId: number | null;
    current: ProductColorItem | null;
    status: ActionStatus | 'rejected';
    sort: SortProps<ProductColorItem>;
    showInactive: boolean;
}

const adapter = createEntityAdapter<ProductColorItem, number>({
    selectId: (arg) => arg.id,
    sortComparer: (a, b) => a.id - b.id,
});

const selectors = adapter.getSelectors();

const extraState: ProductColorItemsState = {
    productId: null,
    current: null,
    status: 'idle',
    sort: {field: 'colorCode', ascending: true},
    showInactive: false
};

export const productColorItemsSlice = createSlice({
    name: 'productColorItems',
    initialState: adapter.getInitialState(extraState),
    reducers: {
        setCurrentColorItem: (state, action: PayloadAction<ProductColorItem | null>) => {
            state.current = action.payload;
        },
        setColorsSort: (state, action: PayloadAction<SortProps<ProductColorItem>>) => {
            state.sort = action.payload;
        },
        setColorsShowInactive: (state, action: PayloadAction<boolean>) => {
            state.showInactive = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadProduct.fulfilled, (state, action) => {
                if (isSellAsColorsProduct(action.payload)) {
                    adapter.setAll(state, action.payload.items);
                    if (state.productId === action.payload.id && !!state.current?.id) {
                        const [item] = action.payload.items.filter(item => item.id === state.current?.id);
                        state.current = item ?? null;
                    }
                } else {
                    adapter.removeAll(state);
                }
                state.productId = action.payload?.id ?? null;
            })
            .addCase(saveCurrentColorItem.pending, (state) => {
                state.status = 'saving';
            })
            .addCase(saveCurrentColorItem.fulfilled, (state, action) => {
                adapter.setAll(state, action.payload ?? []);
                state.status = 'idle';
                const item = action.payload.find(item => item.colorCode === action.meta.arg.colorCode);
                state.current = item ?? null;
            })
            .addCase(saveCurrentColorItem.rejected, (state) => {
                state.status = 'rejected';
            })
            .addCase(removeColorItem.pending, (state) => {
                state.status = 'deleting';
            })
            .addCase(removeColorItem.fulfilled, (state, action) => {
                state.status = 'idle'
                adapter.setAll(state, action.payload ?? []);
                state.current = null;
            })
            .addCase(removeColorItem.rejected, (state) => {
                state.status = 'rejected'
            })
            .addCase(dismissAlert, (state, action) => {
                if (action.payload.context && [saveCurrentColorItem.typePrefix, removeColorItem.typePrefix].includes(action.payload.context)) {
                    state.status = 'idle';
                }
            })
    },
    selectors: {
        selectCurrentProductColors: (state) => selectors.selectAll(state),
        selectCurrentColorItem: (state) => state.current,
        selectCurrentColorStatus: (state) => state.status,
        selectCurrentColorShowInactive: (state) => state.showInactive,
        selectCurrentColorSort: (state) => state.sort,
    }
});

export const {
    setCurrentColorItem,
    setColorsSort,
    setColorsShowInactive,
} = productColorItemsSlice.actions;
export const {
    selectCurrentProductColors,
    selectCurrentColorItem,
    selectCurrentColorStatus,
    selectCurrentColorShowInactive,
    selectCurrentColorSort
} = productColorItemsSlice.selectors;
export const selectFilteredProductColors = createSelector(
    [selectCurrentProductColors, selectCurrentColorShowInactive, selectCurrentColorSort],
    (list, showInactive, sort) => {
        return list
            .filter(c => showInactive || (c.productStatus !== 'D' && c.selfStatus))
            .sort(productColorSorter(sort))
    }
)
