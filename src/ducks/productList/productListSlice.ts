import {ProductListItem} from "b2b-types";
import {createEntityAdapter, createSelector, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {loadProductsList, setProductsSort} from "./actions";
import {localStorageKeys} from "@/src/api/preferences";
import {LocalStore} from "chums-ui-utils";
import {saveProduct} from "../products/product/actions";
import {listItemFromProduct} from "../products/utils";
import {SortProps} from "chums-types";
import {productListSorter} from "@/ducks/products/sorter";


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
    loading: boolean;
    search: string;
    filter: ProductFilter;
    sort: SortProps<ProductListItem>;
}

const listAdapter = createEntityAdapter<ProductListItem, number>({
    selectId: (arg) => arg.id,
    sortComparer: (a, b) => a.id - b.id,
})

const adapterSelectors = listAdapter.getSelectors();

export const initialProductsListState = (): ProductsListState => ({
    loading: false,
    search: '',
    filter: {
        ...defaultFilter,
        isActive: LocalStore.getItem<boolean>(localStorageKeys.products.filterActive, true) ?? true,
    },
    sort: LocalStore.getItem<SortProps<ProductListItem>>(localStorageKeys.products.sort, {...defaultSort}),
})

const productListSlice = createSlice({
    name: "productList",
    initialState: listAdapter.getInitialState(initialProductsListState()),
    reducers: {
        setProductsSearch: (state, action: PayloadAction<string>) => {
            state.search = action.payload;
        },
        toggleFilterActive: (state, action: PayloadAction<boolean | undefined>) => {
            state.filter.isActive = action.payload ?? !state.filter.isActive;
        },
        toggleFilterOnSale: (state, action: PayloadAction<boolean | undefined>) => {
            state.filter.hasSalePrice = action.payload ?? !state.filter.hasSalePrice;
        },
        toggleFilterAvailable: (state, action: PayloadAction<boolean | undefined>) => {
            state.filter.isAvailableForSale = action.payload ?? !state.filter.isAvailableForSale;
        },
        setCategoryFilter: (state, action: PayloadAction<number | null>) => {
            state.filter.categoryId = action.payload ?? null;
        },
        setSeasonFilter: (state, action: PayloadAction<string>) => {
            state.filter.season = action.payload;
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(loadProductsList.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadProductsList.fulfilled, (state, action) => {
                listAdapter.setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(loadProductsList.rejected, (state) => {
                state.loading = false;
            })
            .addCase(setProductsSort, (state, action) => {
                state.sort = action.payload;
            })
            .addCase(saveProduct.fulfilled, (state, action) => {
                if (action.payload) {
                    listAdapter.setOne(state, listItemFromProduct(action.payload));
                    const product = adapterSelectors.selectById(state, action.payload.defaultParentProductsId);
                    if (action.payload.defaultParentProductsId && product) {
                        listAdapter.setOne(state, {
                            ...listItemFromProduct(action.payload),
                            parentProductKeyword: product.keyword
                        });
                    }
                }
            })
    },
    selectors: {
        selectProductList: (state) => adapterSelectors.selectAll(state),
        selectProductListLoading: (state) => state.loading,
        selectProductsSearch: (state) => state.search,
        selectProductsFilterCategoryId: (state) => state.filter.categoryId,
        selectProductsFilterActive: (state) => state.filter.isActive,
        selectProductsFilterOnSale: (state) => state.filter.hasSalePrice,
        selectProductsFilterAvailable: (state) => state.filter.isAvailableForSale,
        selectProductListSort: (state) => state.sort,
        selectProductSeasonFilter: (state) => state.filter.season,
    }
})

export const {
    setProductsSearch,
    setSeasonFilter,
    toggleFilterActive,
    toggleFilterAvailable,
    toggleFilterOnSale,
    setCategoryFilter
} = productListSlice.actions;
export const {
    selectProductList,
    selectProductListLoading,
    selectProductsSearch,
    selectProductsFilterCategoryId,
    selectProductsFilterActive,
    selectProductsFilterAvailable,
    selectProductListSort,
    selectProductSeasonFilter,
    selectProductsFilterOnSale
} = productListSlice.selectors;

export const selectFilteredList = createSelector(
    [selectProductList, selectProductsSearch, selectProductsFilterActive, selectProductsFilterAvailable,
        selectProductsFilterOnSale, selectProductsFilterCategoryId, selectProductSeasonFilter, selectProductListSort],
    (list, search, filterActive, filterAvailable, filterOnSale, categoryId, season, sort) => {
        let reSearch = /^/;
        try {
            reSearch = new RegExp(search, 'i');
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err: unknown) {
            reSearch = /^/;
        }
        return (list as ProductListItem[])
            .filter(i => !filterActive || i.status)
            .filter(i => !filterAvailable || i.availableForSale)
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


export default productListSlice;
