import type {ActionStatus, ProductMixComponent, ProductMixItem} from "b2b-types";
import {loadProduct, saveProduct} from "@/ducks/products/actions/product-actions.ts";
import {isSellAsMixProduct} from "@/ducks/products/utils/utils.ts";
import {saveMix, saveMixComponent} from "@/ducks/products/actions/mix-actions.ts";
import {createSlice} from "@reduxjs/toolkit";

export interface ProductMixState {
    mix: ProductMixItem | null;
    items: ProductMixComponent[];
    status: ActionStatus;
}

const initialState: ProductMixState = {
    mix: null,
    items: [],
    status: 'idle'
};

export const productMixSlice = createSlice({
    name: 'productMix',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadProduct.fulfilled, (state, action) => {
                if (isSellAsMixProduct(action.payload)) {
                    state.mix = action.payload.mix;
                    state.items = action.payload.mix.items ?? []
                } else {
                    state.mix = null;
                    state.items = [];
                }
            })
            .addCase(saveProduct.fulfilled, (state, action) => {
                if (isSellAsMixProduct(action.payload)) {
                    state.mix = action.payload.mix;
                    state.items = action.payload.mix.items ?? []
                } else {
                    state.mix = null;
                }
            })
            .addCase(saveMix.pending, (state) => {
                state.status = 'saving';
            })
            .addCase(saveMix.fulfilled, (state, action) => {
                state.mix = action.payload;
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
            })
            .addCase(saveMixComponent.rejected, (state) => {
                state.status = 'idle';
            })
    },
    selectors: {
        selectCurrentMix: (state) => state.mix,
        selectCurrentMixComponents: (state) => state.items,
        selectCurrentMixStatus: (state) => state.status,
    }
})

export const {} = productMixSlice.actions;
export const {selectCurrentMixComponents, selectCurrentMixStatus, selectCurrentMix} = productMixSlice.selectors;
