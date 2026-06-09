import {createAsyncThunk} from "@reduxjs/toolkit";
import type {ProductListItem} from "chums-types/b2b";
import {fetchProducts} from "./api";
import {type RootState} from "@/app/configureStore";
import {selectProductListLoading} from "./productListSlice.ts";


export const loadProductsList = createAsyncThunk<ProductListItem[]>(
    'productList/load',
    async () => {
        return await fetchProducts();
    },
    {
        condition: (_, {getState}) => {
            const state = getState() as RootState
            return !selectProductListLoading(state)
        }
    }
)
