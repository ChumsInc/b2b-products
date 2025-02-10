import {ProductList, ProductListItem} from "b2b-types";
import {createReducer} from "@reduxjs/toolkit";
import {
    loadProductsList,
    setCategoryFilter,
    setProductsSearch,
    setProductsSort,
    setSeasonFilter,
    toggleFilterActive,
    toggleFilterAvailable,
    toggleFilterOnSale
} from "./actions";
import {localStorageKeys} from "../../../api/preferences";
import {LocalStore} from "chums-ui-utils";
import {saveProduct} from "../product/actions";
import {listItemFromProduct} from "../utils";
import {SortProps} from "chums-types";


export interface ProductFilter {
    isActive: boolean,
    isAvailableForSale: boolean;
    hasSalePrice: boolean,
    categoryId: number | null;
    season: string;
}

export const defaultFilter: ProductFilter = {
    isActive: true,
    isAvailableForSale: false,
    hasSalePrice: false,
    categoryId: null,
    season: '',
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
    sort: SortProps<ProductListItem>;
}

export const initialProductsListState = (): ProductsListState => ({
    list: {},
    loading: false,
    search: '',
    filter: {
        ...defaultFilter,
        isActive: LocalStore.getItem<boolean>(localStorageKeys.products.filterActive, true) ?? true,
    },
    sort: {...defaultSort},
})

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
        })
        .addCase(loadProductsList.rejected, (state) => {
            state.loading = false;
        })
        .addCase(setProductsSearch, (state, action) => {
            state.search = action.payload;
        })
        .addCase(toggleFilterActive, (state, action) => {
            state.filter.isActive = action.payload ?? !state.filter.isActive;
        })
        .addCase(toggleFilterOnSale, (state, action) => {
            state.filter.hasSalePrice = action.payload ?? !state.filter.hasSalePrice;
        })
        .addCase(toggleFilterAvailable, (state, action) => {
            state.filter.isAvailableForSale = action.payload ?? !state.filter.isAvailableForSale;
        })
        .addCase(setCategoryFilter, (state, action) => {
            state.filter.categoryId = action.payload ?? null;
        })
        .addCase(setSeasonFilter, (state, action) => {
            state.filter.season = action.payload;
        })
        .addCase(setProductsSort, (state, action) => {
            state.sort = action.payload;
        })
        .addCase(saveProduct.fulfilled, (state, action) => {
            if (action.payload) {
                state.list[action.payload.keyword] = listItemFromProduct(action.payload);
                const [old] = Object.values(state.list).filter(p => p.id === action.payload?.id && p.keyword !== action.payload.keyword);
                if (old) {
                    delete state.list[old.keyword];
                }
                if (action.payload.defaultParentProductsId) {
                    const [product] = Object.values(state.list).filter(p => p.id === action.payload?.defaultParentProductsId);
                    state.list[action.payload.keyword].parentProductKeyword = product.keyword ?? null;
                }
            }
        })
})

export default productsListReducer;
