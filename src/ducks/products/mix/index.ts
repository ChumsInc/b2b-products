import {isSellAsMixProduct} from "../utils";
import {createReducer} from "@reduxjs/toolkit";
import {loadProduct, saveProduct} from "../product/actions";
import {ActionStatus, ProductMixItem,} from "b2b-types";
import {loadMixBOM, saveMix, saveMixComponent} from "./actions";
import {BOMComponent, BOMHeader} from "../../../types/item-search";
import Decimal from "decimal.js";

export interface CurrentMixState {
    mix: ProductMixItem | null;
    status: ActionStatus;
    bom: {
        header: BOMHeader | null;
        detail: BOMComponent[];
        status: ActionStatus;
    }
}

export const initialCurrentMixState: CurrentMixState = {
    mix: null,
    status: 'idle',
    bom: {
        header: null,
        detail: [],
        status: 'idle'
    }
}

const currentMixReducer = createReducer(initialCurrentMixState, (builder) => {
    builder
        .addCase(loadProduct.fulfilled, (state, action) => {
            if (action.payload && isSellAsMixProduct(action.payload)) {
                state.mix = action.payload.mix;
            } else {
                state.mix = null;
                state.bom.header = null;
                state.bom.detail = [];
            }
        })
        .addCase(saveProduct.fulfilled, (state, action) => {
            if (action.payload && isSellAsMixProduct(action.payload)) {
                state.mix = action.payload.mix;
            } else {
                state.mix = null;
                state.bom.header = null;
                state.bom.detail = [];
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
        .addCase(loadMixBOM.pending, (state) => {
            state.bom.status = 'loading';
        })
        .addCase(loadMixBOM.fulfilled, (state, action) => {
            state.bom.status = 'idle';
            if (action.payload?.billHeader.length === 1) {
                state.bom.header = action.payload.billHeader[0];
                state.bom.detail = action.payload.billDetail
                    .map(row => ({
                        ...row,
                        QuantityPerBill: new Decimal(row.QuantityPerBill).times(state.bom.header!.SalesUMConvFctr).round().toNumber()
                    }))
                    .sort((a, b) => a.LineSeqNo > b.LineSeqNo ? 1 : -1)
            }
        })
        .addCase(loadMixBOM.rejected, (state) => {
            state.bom.status = 'idle';
        })
});

export default currentMixReducer;
