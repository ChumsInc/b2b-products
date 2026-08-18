import type {ActionStatus, ProductMixComponent, ProductMixItem} from "chums-types/b2b";
import {loadProduct, saveProduct} from "@/ducks/products/actions/product-actions.ts";
import {isSellAsMixProduct} from "@/ducks/products/utils/utils.ts";
import {saveMix, saveMixComponent} from "@/ducks/products/actions/mix-actions.ts";
import {createEntityAdapter, createSlice} from "@reduxjs/toolkit";

const adapter = createEntityAdapter<ProductMixComponent, number>({
    selectId: (arg) => arg.id,
    sortComparer: (a, b) => a.id - b.id,
})

const selectors = adapter.getSelectors();

export interface ProductMixState {
    mix: ProductMixItem | null;
    status: ActionStatus;
}

const initialState: ProductMixState = {
    mix: null,
    status: 'idle'
};

export const productMixSlice = createSlice({
    name: 'productMix',
    initialState: adapter.getInitialState(initialState),
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadProduct.fulfilled, (state, action) => {
                if (isSellAsMixProduct(action.payload)) {
                    state.mix = action.payload.mix;
                    adapter.setAll(state, action.payload.mix.items ?? []);
                } else {
                    state.mix = null;
                    adapter.removeAll(state);
                }
            })
            .addCase(saveProduct.fulfilled, (state, action) => {
                if (isSellAsMixProduct(action.payload)) {
                    state.mix = action.payload.mix;
                    adapter.setAll(state, action.payload.mix.items ?? []);
                } else {
                    state.mix = null;
                }
            })
            .addCase(saveMix.pending, (state) => {
                state.status = 'saving';
            })
            .addCase(saveMix.fulfilled, (state, action) => {
                state.mix = action.payload;
                adapter.setAll(state, action.payload?.items ?? []);
                state.status = 'idle';
            })
            .addCase(saveMix.rejected, (state) => {
                state.status = 'idle';
            })
            .addCase(saveMixComponent.pending, (state) => {
                state.status = 'saving';
            })
            .addCase(saveMixComponent.fulfilled, (state, action) => {
                state.status = 'idle';
                state.mix = action.payload;
                adapter.setAll(state, action.payload?.items ?? []);
            })
            .addCase(saveMixComponent.rejected, (state) => {
                state.status = 'idle';
            })
    },
    selectors: {
        selectCurrentMix: (state) => state.mix,
        selectCurrentMixComponents: (state) => selectors.selectAll(state),
        selectCurrentMixStatus: (state) => state.status,
    }
})

// export const {} = productMixSlice.actions;
export const {selectCurrentMixComponents, selectCurrentMixStatus, selectCurrentMix} = productMixSlice.selectors;
