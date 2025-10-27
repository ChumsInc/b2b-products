import type {ProductListItem} from "b2b-types";
import type {SortProps} from "chums-types";
import {createEntityAdapter, createSelector, createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {LocalStore} from "chums-ui-utils";
import {loadProductsList} from "./actions";
import {localStorageKeys} from "@/src/api/preferences";
import {saveProduct} from "../products/actions/product-actions.ts";
import {listItemFromProduct} from "../products/utils/utils.ts";
import type {ProductFilter, ProductsListState} from "@/ducks/productList/types.ts";
import {productListSorter} from "@/ducks/products/utils/sorter.ts";


const defaultSort: SortProps<ProductListItem> = {
    field: 'id',
    ascending: true,
}

export const defaultFilter: ProductFilter = {
    showInactive: false,
    showUnavailable: false,
    hasSalePrice: false,
    categoryId: null,
    season: '',
};

export const extraState = (): ProductsListState => ({
    loading: false,
    status: 'idle',
    search: '',
    filter: {
        ...defaultFilter,
        showInactive: LocalStore.getItem<boolean>(localStorageKeys.products.showInactive, true) ?? true,
    },
    sort: LocalStore.getItem<SortProps<ProductListItem>>(localStorageKeys.products.sort, {...defaultSort}),
})

const adapter = createEntityAdapter<ProductListItem, number>({
    selectId: (item) => item.id,
    sortComparer: (a, b) => a.id > b.id ? 1 : -1,
})
const selectors = adapter.getSelectors();

const productListSlice = createSlice({
    name: 'productList',
    initialState: adapter.getInitialState(extraState()),
    reducers: {
        setProductsSearch: (state, action) => {
            state.search = action.payload;
        },
        toggleShowInactive: (state, action: PayloadAction<boolean>) => {
            state.filter.showInactive = action.payload;
        },
        toggleFilterOnSale: (state, action: PayloadAction<boolean | undefined>) => {
            state.filter.hasSalePrice = action.payload ?? !state.filter.hasSalePrice;
        },
        toggleShowUnavailable: (state, action: PayloadAction<boolean>) => {
            state.filter.showUnavailable = action.payload ?? !state.filter.showUnavailable;
        },
        setCategoryFilter: (state, action: PayloadAction<number | null>) => {
            state.filter.categoryId = action.payload ?? null;
        },
        setSeasonFilter: (state, action: PayloadAction<string>) => {
            state.filter.season = action.payload;
        },
        setProductsSort: (state, action: PayloadAction<SortProps<ProductListItem>>) => {
            state.sort = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadProductsList.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadProductsList.fulfilled, (state, action) => {
                adapter.setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(loadProductsList.rejected, (state) => {
                state.loading = false;
            })
            .addCase(saveProduct.fulfilled, (state, action) => {
                if (action.payload) {
                    adapter.setOne(state, listItemFromProduct(action.payload));
                    const product = selectors.selectById(state, action.payload.defaultParentProductsId);
                    if (action.payload.defaultParentProductsId && product) {
                        adapter.setOne(state, {
                            ...listItemFromProduct(action.payload),
                            parentProductKeyword: product.keyword
                        });
                    }
                }
            })
    },
    selectors: {
        selectProductList: (state) => selectors.selectAll(state),
        selectProductsListStatus: (state) => state.status,
        selectProductListLoading: (state) => state.loading,
        selectProductsSearch: (state) => state.search,
        selectProductsFilterCategoryId: (state) => state.filter.categoryId,
        selectProductsShowInactive: (state) => state.filter.showInactive,
        selectProductsFilterOnSale: (state) => state.filter.hasSalePrice,
        selectProductsShowUnavailable: (state) => state.filter.showUnavailable,
        selectProductSeasonFilter: (state) => state.filter.season,
        selectProductListSort: (state) => state.sort,
    }
})
export default productListSlice;
export const {
    setProductsSearch,
    toggleShowInactive,
    toggleFilterOnSale,
    toggleShowUnavailable,
    setCategoryFilter,
    setSeasonFilter,
    setProductsSort
} = productListSlice.actions;
export const {
    selectProductsListStatus,
    selectProductList,
    selectProductsSearch,
    selectProductListSort,
    selectProductsShowInactive,
    selectProductSeasonFilter,
    selectProductsShowUnavailable,
    selectProductsFilterCategoryId,
    selectProductsFilterOnSale,
    selectProductListLoading
} = productListSlice.selectors;

export const selectFilteredList = createSelector(
    [selectProductList, selectProductsSearch, selectProductsShowInactive, selectProductsShowUnavailable,
        selectProductsFilterOnSale, selectProductsFilterCategoryId, selectProductSeasonFilter, selectProductListSort],
    (list, search, showInactive, showUnavailable, filterOnSale, categoryId, season, sort) => {
        let reSearch = /^/;
        try {
            reSearch = new RegExp(search, 'i');
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err: unknown) {
            reSearch = /^/;
        }
        return (list as ProductListItem[])
            .filter(i => showInactive || i.status)
            .filter(i => showUnavailable || i.availableForSale)
            .filter(i => !filterOnSale || !!i.salePrice)
            .filter(i => !categoryId || i.defaultCategoriesId === categoryId)
            .filter(i => !season || i.season_code === season)
            .filter(i => {
                return search === ''
                    || reSearch.test(i.keyword)
                    || reSearch.test(i.name)
                    || reSearch.test(i.itemCode)
                    || reSearch.test(i.id.toString())
                    || reSearch.test((i.defaultParentProductsId || 0).toString())
            })
            .sort(productListSorter(sort));
    }
)
