import {isSellAsMixProduct} from "../utils";
import {createReducer} from "@reduxjs/toolkit";
import {loadProduct, saveProduct, setNewProduct} from "../product/actions";
import {ProductMixItem} from "b2b-types";
import {saveMix, saveMixComponent} from "./actions";

export interface CurrentMixState {
    mix: ProductMixItem | null;
    loading: boolean;
    saving: boolean;
}

export const initialCurrentMixState: CurrentMixState = {
    mix: null,
    loading: false,
    saving: false,
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
            state.saving = true;
        })
        .addCase(saveMix.fulfilled, (state, action) => {
            state.mix = action.payload;
            state.saving = false;
        })
        .addCase(saveMix.rejected, (state) => {
            state.saving = false;
        })
        .addCase(saveMixComponent.pending, (state) => {
            state.saving = true;
        })
        .addCase(saveMixComponent.fulfilled, (state, action) => {
            state.saving = false;
            state.mix = action.payload;
        })
        .addCase(saveMixComponent.rejected, (state) => {
            state.saving = false;
        })
});

export default currentMixReducer;
