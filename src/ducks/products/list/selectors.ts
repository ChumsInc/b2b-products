import {RootState} from "../../../app/configureStore";

import {productListSorter} from "../sorter";
import {createSelector} from "@reduxjs/toolkit";

export const selectProductList = (state: RootState) => state.products.list.list;
export const selectProductListLoading = (state: RootState) => state.products.list.loading;
export const selectProductsSearch = (state: RootState) => state.products.list.search;
export const selectProductsFilter = (state: RootState) => state.products.list.filter;
export const selectProductsFilterCategoryId = (state: RootState) => state.products.list.filter.categoryId;
export const selectProductsFilterActive = (state: RootState) => state.products.list.filter.isActive;
export const selectProductsFilterOnSale = (state: RootState) => state.products.list.filter.hasSalePrice;
export const selectProductsFilterAvailable = (state: RootState) => state.products.list.filter.isAvailableForSale;
export const selectProductListSort = (state: RootState) => state.products.list.sort;
export const selectProductSeasonFilter = (state:RootState) => state.products.list.filter.season;

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
        return Object.values(list)
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
