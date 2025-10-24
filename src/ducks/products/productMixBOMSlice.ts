import type {ActionStatus} from "b2b-types";
import {loadProduct, saveProduct} from "@/ducks/products/actions/product-actions.ts";
import {isSellAsMixProduct} from "@/ducks/products/utils/utils.ts";
import {loadMixBOM} from "@/ducks/products/actions/mix-actions.ts";
import {createSlice} from "@reduxjs/toolkit";
import type {BOMComponent, BOMHeader} from "@/types/item-search.ts";
import Decimal from "decimal.js";

export interface ProductMixBOMState {
    header: BOMHeader | null;
    detail: BOMComponent[];
    status: ActionStatus | 'rejected';
}

const initialState: ProductMixBOMState = {
    header: null,
    detail: [],
    status: 'idle'
};

export const productMixBOMSlice = createSlice({
    name: 'productMixBOM',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadProduct.fulfilled, (state, action) => {
                if (!isSellAsMixProduct(action.payload)) {
                    state.header = null;
                    state.detail = [];
                }
            })
            .addCase(saveProduct.fulfilled, (state, action) => {
                if (!isSellAsMixProduct(action.payload)) {
                    state.header = null;
                    state.detail = [];
                }
            })
            .addCase(loadMixBOM.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loadMixBOM.fulfilled, (state, action) => {
                state.status = 'idle';
                if (action.payload?.billHeader.length === 1) {
                    state.header = action.payload.billHeader[0];
                    state.detail = action.payload.billDetail
                        .map(row => ({
                            ...row,
                            QuantityPerBill: new Decimal(row.QuantityPerBill).times(state.header!.SalesUMConvFctr).round().toNumber()
                        }))
                        .sort((a, b) => a.LineSeqNo > b.LineSeqNo ? 1 : -1)
                }
            })
            .addCase(loadMixBOM.rejected, (state) => {
                state.status = 'rejected';
            })
    },
    selectors: {
        selectCurrentMixBOMHeader: (state) => state.header,
        selectCurrentMixBOMDetail: (state) => state.detail,
        selectCurrentMixBOMStatus: (state) => state.status,
    }
})

export const {} = productMixBOMSlice.actions;
export const {
    selectCurrentMixBOMHeader,
    selectCurrentMixBOMStatus,
    selectCurrentMixBOMDetail
} = productMixBOMSlice.selectors;
