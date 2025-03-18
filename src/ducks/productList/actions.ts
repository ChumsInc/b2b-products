import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {ProductListItem} from "b2b-types";
import {fetchProducts} from "./api";
import {SortProps} from "chums-types";
import {RootState} from "@/app/configureStore";
import {selectProductListLoading} from "./productListSlice";
import {LocalStore} from "chums-ui-utils";
import {localStorageKeys} from "@/src/api/preferences";

export const loadProductsList = createAsyncThunk<ProductListItem[]>(
    'products/productList/load',
    async () => {
        return await fetchProducts();
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState
            return !selectProductListLoading(state)
        }
    }
)

export const setProductsSort = createAction('products/productList/setSort', (sort:SortProps<ProductListItem>) => {
    LocalStore.setItem(localStorageKeys.products.sort, sort);
    return {
        payload: sort
    }
});

