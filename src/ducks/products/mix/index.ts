import {isSellAsMixProduct} from "../utils";
import {createReducer} from "@reduxjs/toolkit";
import {loadProduct, saveProduct, setNewProduct} from "../product/actions";
import {ActionStatus, ProductMixItem} from "b2b-types";
import {saveMix, saveMixComponent} from "./actions";

export interface CurrentMixState {
    mix: ProductMixItem | null;
    status: ActionStatus;
}

export const initialCurrentMixState: CurrentMixState = {
    mix: null,
    status: 'idle'
}

const currentMixReducer = createReducer(initialCurrentMixState, (builder) => {
    builder
        .addCase(setNewProduct, (state) => {
            state.mix = null;
        })
        .addCase(loadProduct.fulfilled, (state, action) => {
            if (action.payload && isSellAsMixProduct(action.payload)) {
                state.mix = action.payload.mix;
            } else {
                state.mix = null;
            }
        })
        .addCase(saveProduct.fulfilled, (state, action) => {
            if (action.payload && isSellAsMixProduct(action.payload)) {
                state.mix = action.payload.mix;
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
});

export default currentMixReducer;
