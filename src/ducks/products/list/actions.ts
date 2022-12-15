import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {ProductListItem} from "b2b-types";
import {fetchProducts} from "../../../api/productsAPI";
import {SortProps} from "chums-components";

export const loadProductsList = createAsyncThunk<ProductListItem[]>(
    'products/list/load',
    async () => {
        return await fetchProducts();
    }
)

export const setProductsSearch = createAction<string>('products/list/setSearch');

export const toggleFilterActive = createAction<boolean|undefined>('products/list/filterActive');

export const toggleFilterOnSale = createAction<boolean|undefined>('products/list/filterOnSale');

export const toggleFilterAvailable = createAction<boolean|undefined>('products/list/filterAvailable');

export const setPage = createAction<number>('products/list/setPage');

export const setRowsPerPage = createAction<number>('products/list/setRowsPerPage');

export const setProductsSort = createAction<SortProps<ProductListItem>>('products/list/setSort');

export const setCategoryFilter = createAction<number|null>('products/list/filterCategory');
