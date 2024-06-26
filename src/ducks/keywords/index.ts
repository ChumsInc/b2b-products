import {Keyword} from "b2b-types";
import {fetchKeywords} from "../../api/keywordsAPI";
import {RootState} from "../../app/configureStore";
import {createAsyncThunk, createReducer} from "@reduxjs/toolkit";
import {saveProduct} from "../products/product/actions";

export interface KeywordsState {
    list: Keyword[];
    loading: boolean;
    loaded: boolean;
}

export const initialKeywordsState: KeywordsState = {
    list: [],
    loading: false,
    loaded: false,
}

export const keywordTitleSorter = (a: Keyword, b: Keyword) => a.title.toLowerCase() === b.title.toLowerCase()
    ? (a.keyword > b.keyword ? 1 : -1)
    : (a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1);

export const selectKeywordsList = (state: RootState) => state.keywords.list;
export const selectKeywordsLoading = (state: RootState) => state.keywords.loading;
export const selectKeywordsLoaded = (state: RootState) => state.keywords.loaded;

export const loadKeywords = createAsyncThunk(
    'keywords/load',
    async () => {
        return await fetchKeywords();
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectKeywordsLoading(state);
        }
    }
);

const keywordsReducer = createReducer(initialKeywordsState, (builder) => {
    builder
        .addCase(loadKeywords.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadKeywords.fulfilled, (state, action) => {
            state.loading = false;
            state.loaded = true;
            state.list = action.payload.sort((a, b) => a.keyword > b.keyword ? 1 : -1)
        })
        .addCase(loadKeywords.rejected, (state) => {
            state.loading = false;
        })
        .addCase(saveProduct.fulfilled, (state, action) => {
            if (action.payload) {
                const {id, keyword, name, parentProductKeyword, redirectToParent, status} = action.payload;
                const newKeyword:Keyword = {id, keyword, pagetype: 'product', title: name, parent: parentProductKeyword ?? '', redirect_to_parent: redirectToParent ? 1 : 0, status};
                state.list = [
                    ...state.list.filter(kw => kw.pagetype !== 'product' || (kw.pagetype === 'product' && kw.id !== id)),
                    newKeyword
                ].sort((a, b) => a.keyword > b.keyword ? 1 : -1);
            }
        })
});

export default keywordsReducer;

