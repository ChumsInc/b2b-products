import {createSlice} from "@reduxjs/toolkit";
import {loadProduct, saveProduct} from "@/ducks/products/actions/product-actions.ts";

export interface CurrentKeywordState {
    keyword: string;
}

const initialState: CurrentKeywordState = {keyword: ''};

const productKeywordSlice = createSlice({
    name: 'currentKeyword',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
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
    },
    selectors: {
        selectCurrentKeyword: (state) => state.keyword,
    }
});

export default productKeywordSlice;
export const {selectCurrentKeyword} = productKeywordSlice.selectors;
