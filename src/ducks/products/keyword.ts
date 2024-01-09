import {createReducer} from "@reduxjs/toolkit";
import {duplicateProduct, loadProduct, saveProduct, setNewProduct} from "./product/actions";
import {RootState} from "../../app/configureStore";

export interface KeywordState {
    keyword: string;
}

const initialState: KeywordState = {
    keyword: '',
}

export const selectCurrentKeyword = (state:RootState) => state.products.current.keyword.keyword;

const productKeywordReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(setNewProduct, (state) => {
            state.keyword = '';
        })
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
