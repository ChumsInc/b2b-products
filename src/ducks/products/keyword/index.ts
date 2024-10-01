import {createReducer} from "@reduxjs/toolkit";
import {loadProduct, saveProduct} from "../product/actions";

export interface KeywordState {
    keyword: string;
}

const initialState: KeywordState = {
    keyword: '',
}

const productKeywordReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(loadProduct.fulfilled, (state, action) => {
            if (action.payload) {
                state.keyword = action.payload.keyword;
            }
        })
        .addCase(saveProduct.fulfilled, (state, action) => {
            if (action.payload) {
                state.keyword = action.payload.keyword;
            }
        })

});

export default productKeywordReducer;
