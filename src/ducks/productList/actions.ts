import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import type {ProductListItem} from "b2b-types";
import {fetchProducts} from "./api";
import type {SortProps} from "chums-types";
import {type RootState} from "@/app/configureStore";
import {selectProductListLoading} from "./productListSlice.ts";
import {LocalStore} from "chums-ui-utils";
import {localStorageKeys} from "@/src/api/preferences";


export const setProductsSearch = createAction<string>('productsList/setSearch');
export const toggleFilterActive = createAction<boolean|undefined>('productsList/toggleFilterActive');
export const toggleFilterOnSale = createAction<boolean|undefined>('productsList/toggleFilterOnSale');
export const toggleFilterAvailable = createAction<boolean|undefined>('productsList/toggleFilterAvailable');
export const setCategoryFilter = createAction<number|null>('productsList/setCategoryFilter');
export const setSeasonFilter = createAction<string>('productsList/setSeasonFilter');

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

export const setProductsSort = createAction('productList/setSort', (sort:SortProps<ProductListItem>) => {
    LocalStore.setItem(localStorageKeys.products.sort, sort);
    return {
        payload: sort
    }
});
