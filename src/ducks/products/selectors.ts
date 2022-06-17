import {RootState} from "../../app/configureStore";
import {createSelector} from "reselect";
import {filterPage, selectCurrentPage, selectPageFilter, selectRowsPerPage, selectTableSort} from "chums-ducks";
import {productListSorter} from "./sorter";
import {ProductListSorterProps} from "../../types/product";
import {ProductColorItem, ProductColorVariant} from "b2b-types/src/products";

export const productListTableKey = 'products-list';

export const selectProductList = (state:RootState) => Object.values(state.products.list.list);
export const selectProductListLength = (state:RootState) => Object.keys(state.products.list.list).length;
export const selectProductListLoading = (state:RootState) => state.products.list.loading;
export const selectProductsSearch = (state:RootState) => state.products.list.search;
export const selectProductsFilter = (state:RootState) => state.products.list.filter;
export const selectProductsFilterActive = (state:RootState) => state.products.list.filter.isActive;
export const selectProductsFilterOnSale = (state:RootState) => state.products.list.filter.hasSalePrice;
export const selectProductsFilterAvailable = (state:RootState) => state.products.list.filter.isAvailableForSale;

export const selectCurrentProduct = (state:RootState) => state.products.currentProduct.product;
export const selectCurrentProductChanged = (state:RootState):boolean => state.products.currentProduct.product.changed || false;
export const selectCurrentProductLoading = (state:RootState) => state.products.currentProduct.loading;
export const selectCurrentProductSaving = (state:RootState) => state.products.currentProduct.saving;
export const selectCurrentProductVariants = (state:RootState) => state.products.currentProduct.product.variants || [];

export const selectCurrentVariant = (state:RootState) => state.products.currentVariant.variant;
export const selectCurrentVariantChanged = (state:RootState):boolean => state.products.currentVariant.variant.changed || false;
export const selectCurrentVariantLoading = (state:RootState) => state.products.currentVariant.loading;
export const selectCurrentVariantSaving = (state:RootState) => state.products.currentVariant.saving;

export const selectCurrentProductColors = (state:RootState) => state.products.currentColor.list || [];
export const selectCurrentColorItem = (state:RootState) => state.products.currentColor.colorItem;
export const selectCurrentColorItemLoading = (state:RootState):boolean => state.products.currentColor.loading;
export const selectCurrentColorItemSaving = (state:RootState):boolean => state.products.currentColor.saving;

export const selectCurrentMix = (state:RootState) => state.products.currentMix.mix;
export const selectCurrentMixComponents = (state:RootState) => state.products.currentMix.components;
export const selectCurrentMixLoading =(state:RootState) => state.products.currentMix.loading;
export const selectCurrentMixSaving =(state:RootState) => state.products.currentMix.saving;

export const selectFilteredProductsList = createSelector(
    [selectProductList, selectProductsSearch, selectProductsFilter],
    (list, search, filter) => {
        let re = /^/;
        try {
            re = new RegExp(search, 'i');
        } catch(err:unknown) {}
        return list.filter(i => !filter.isActive || i.status)
            .filter(i => !filter.isAvailableForSale || i.availableForSale)
            .filter(i => !filter.hasSalePrice || !!i.salePrice)
            .filter(i => {
                return search === ''
                || re.test(i.keyword) || re.test(i.name) || re.test(i.itemCode)
                || re.test(i.id.toString()) || re.test((i.defaultParentProductsId || 0).toString())
            })

})
export const selectFilteredProductsListLength = createSelector([selectFilteredProductsList], (list) => list.length);

export const selectSortedProductList = createSelector(
    [selectFilteredProductsList,
        selectTableSort(productListTableKey), selectRowsPerPage(productListTableKey), selectCurrentPage(productListTableKey)],
    (list, sort, rpp, page) => {
        return list.sort(productListSorter(sort as ProductListSorterProps))
            .filter(filterPage(page, rpp))
    }
)
