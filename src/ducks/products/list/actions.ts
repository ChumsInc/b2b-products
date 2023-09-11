import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {ProductListItem} from "b2b-types";
import {fetchProducts} from "../../../api/productsAPI";
import {SortProps} from "chums-components";
import {RootState} from "../../../app/configureStore";
import {selectProductListLoading} from "./selectors";
import {getPreference, localStorageKeys, setPreference} from "../../../api/preferences";

export const loadProductsList = createAsyncThunk<ProductListItem[]>(
    'products/list/load',
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

export const setProductsSearch = createAction<string>('products/list/setSearch');

export const toggleFilterActive = createAction('products/list/filterActive', (checked:boolean|undefined) => {
    const filterActive = checked ?? !getPreference(localStorageKeys.products.filterActive, true)
    setPreference(localStorageKeys.products.filterActive, filterActive);
    return {
        payload: filterActive,
    }
});

export const toggleFilterOnSale = createAction<boolean | undefined>('products/list/filterOnSale');

export const toggleFilterAvailable = createAction<boolean | undefined>('products/list/filterAvailable');

export const setPage = createAction<number>('products/list/setPage');

export const setRowsPerPage = createAction('products/list/setRowsPerPage', (rpp: number) => {
    setPreference(localStorageKeys.products.rowsPerPage, rpp);
    return {
        payload: rpp
    }
});

export const setProductsSort = createAction<SortProps<ProductListItem>>('products/list/setSort');

export const setCategoryFilter = createAction<number | null>('products/list/filterCategory');
