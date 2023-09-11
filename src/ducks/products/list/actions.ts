import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {ProductListItem} from "b2b-types";
import {fetchProducts} from "../../../api/productsAPI";
import {SortProps} from "chums-components";
import {RootState} from "../../../app/configureStore";
import {selectProductListLoading} from "./selectors";

export const loadProductsList = createAsyncThunk<ProductListItem[]>(
    'products/colors/load',
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

export const setProductsSearch = createAction<string>('products/colors/setSearch');

export const toggleFilterActive = createAction<boolean | undefined>('products/colors/filterActive');

export const toggleFilterOnSale = createAction<boolean | undefined>('products/colors/filterOnSale');

export const toggleFilterAvailable = createAction<boolean | undefined>('products/colors/filterAvailable');

export const setPage = createAction<number>('products/colors/setPage');

export const setRowsPerPage = createAction<number>('products/colors/setRowsPerPage');

export const setProductsSort = createAction<SortProps<ProductListItem>>('products/colors/setSort');

export const setCategoryFilter = createAction<number | null>('products/colors/filterCategory');
