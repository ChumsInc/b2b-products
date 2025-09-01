import {createAsyncThunk} from "@reduxjs/toolkit";
import type {ProductListItem} from "b2b-types";
import {fetchProducts} from "./api";
import {createAppSlice, type RootState} from "@/app/configureStore";
import {selectProductListLoading} from "./productListSlice";

export const loadProductsList = createAsyncThunk<ProductListItem[]>(
    'products/productList/load',
    async () => {
        return await fetchProducts();
    },
    {
        condition: (_, {getState}) => {
            const state = getState() as RootState
            return !selectProductListLoading(state)
        }
    }
);

export const loadProductListAsync = createAppSlice
