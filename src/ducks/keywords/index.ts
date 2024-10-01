import {Keyword} from "b2b-types";
import {createReducer} from "@reduxjs/toolkit";
import {loadKeywords} from "./actions";
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

export const defaultKWSorter = (a:Keyword, b:Keyword) => a.keyword > b.keyword ? 1 : -1;

const keywordsReducer = createReducer(initialKeywordsState, (builder) => {
    builder
        .addCase(loadKeywords.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadKeywords.fulfilled, (state, action) => {
            state.loading = false;
            state.loaded = true;
            state.list = action.payload.sort(defaultKWSorter)
        })
        .addCase(loadKeywords.rejected, (state) => {
            state.loading = false;
        })
        .addCase(saveProduct.fulfilled, (state, action) => {
            if (action.payload) {
                const {id, keyword, name, parentProductKeyword, redirectToParent, status} = action.payload;
                const newKeyword: Keyword = {
                    id,
                    keyword,
                    pagetype: 'product',
                    title: name,
                    parent: parentProductKeyword ?? '',
                    redirect_to_parent: redirectToParent ? 1 : 0,
                    status
                };
                state.list = [
                    ...state.list.filter(kw => kw.pagetype !== 'product' || (kw.pagetype === 'product' && kw.id !== id)),
                    newKeyword
                ].sort(defaultKWSorter);
            } else {
                state.list = [
                    ...state.list.filter(kw => kw.pagetype !== 'product'),
                    ...state.list.filter(kw => kw.pagetype === 'product' && kw.id !== action.meta.arg.id),
                    ...state.list.filter(kw => kw.pagetype === 'product' && kw.id === action.meta.arg.id)
                        .map(kw => ({...kw, keyword: action.meta.arg.keyword}))
                ].sort(defaultKWSorter)
            }
        })
});

export default keywordsReducer;

