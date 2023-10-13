import {ProductList, ProductListItem} from "b2b-types";
import {createReducer} from "@reduxjs/toolkit";
import {
    loadProductsList, setCategoryFilter,
    setPage,
    setProductsSearch,
    setProductsSort,
    setRowsPerPage,
    toggleFilterActive,
    toggleFilterAvailable,
    toggleFilterOnSale
} from "./actions";
import {getPreference, localStorageKeys, setPreference} from "../../../api/preferences";
import {SortProps} from "chums-components";
import {saveProduct} from "../product/actions";
import {listItemFromProduct} from "../utils";


export interface ProductFilter {
    isActive: boolean,
    isAvailableForSale: boolean,
    hasSalePrice: boolean,
    categoryId: number|null;
}

export const defaultFilter: ProductFilter = {
    isActive: true,
    isAvailableForSale: false,
    hasSalePrice: false,
    categoryId: null,
};

const defaultSort: SortProps<ProductListItem> = {
    field: 'id',
    ascending: true,
}

export interface ProductsListState {
    list: ProductList;
    loading: boolean;
    search: string;
    filter: ProductFilter;
    page: number;
    rowsPerPage: number;
    sort: SortProps<ProductListItem>;
}

export const initialProductsListState: ProductsListState = {
    list: {},
    loading: false,
    search: '',
    filter: {...defaultFilter},
    page: 0,
    rowsPerPage: getPreference(localStorageKeys.products.rowsPerPage, 25),
    sort: {...defaultSort},
}

const productsListReducer = createReducer(initialProductsListState, (builder) => {
    builder
        .addCase(loadProductsList.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadProductsList.fulfilled, (state, action) => {
            state.list = {};
            action.payload.forEach(item => {
                state.list[item.keyword] = item;
            });
            state.loading = false;
            if (state.page > Object.keys(state.list).length % state.rowsPerPage) {
                state.page = 0;
            }
        })
        .addCase(loadProductsList.rejected, (state) => {
            state.loading = false;
        })
        .addCase(setProductsSearch, (state, action) => {
            state.page = 0;
            state.search = action.payload;
        })
        .addCase(toggleFilterActive, (state, action) => {
            state.page = 0;
            state.filter.isActive = action.payload ?? !state.filter.isActive;
        })
        .addCase(toggleFilterOnSale, (state, action) => {
            state.page = 0;
            state.filter.hasSalePrice = action.payload ?? !state.filter.hasSalePrice;
        })
        .addCase(toggleFilterAvailable, (state, action) => {
            state.page = 0;
            state.filter.isAvailableForSale = action.payload ?? !state.filter.isAvailableForSale;
        })
        .addCase(setCategoryFilter, (state, action) => {
            state.filter.categoryId = action.payload ?? null;
        })
        .addCase(setPage, (state, action) => {
            state.page = action.payload;
        })
        .addCase(setRowsPerPage, (state, action) => {
            state.page = 0;
            state.rowsPerPage = action.payload;
            setPreference(localStorageKeys.products.rowsPerPage, action.payload);
        })
        .addCase(setProductsSort, (state, action) => {
            state.sort = action.payload;
            state.page = 0;
        })
        .addCase(saveProduct.fulfilled, (state, action) => {
            state.list[action.payload.keyword] = listItemFromProduct(action.payload);
            const [old] = Object.values(state.list).filter(p => p.id === action.payload.id && p.keyword !== action.payload.keyword);
            if (old) {
                delete state.list[old.keyword];
            }
            if (action.payload.defaultParentProductsId) {
                const [product] = Object.values(state.list).filter(p => p.id === action.payload.defaultParentProductsId);
                state.list[action.payload.keyword].parentProductKeyword = product.keyword ?? null;
            }
        })
})

export default productsListReducer;
