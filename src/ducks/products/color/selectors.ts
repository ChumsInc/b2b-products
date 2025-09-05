import {RootState} from "../../../app/configureStore";
import {createSelector} from "@reduxjs/toolkit";
import {productColorSorter} from "@/ducks/products/color/utils";

export const selectCurrentProductColors = (state: RootState) => state.products.current.color.list;

export const selectCurrentColorItem = (state: RootState) => state.products.current.color.colorItem;

export const selectCurrentColorItemLoading = (state: RootState): boolean => state.products.current.color.loading;

export const selectCurrentColorItemSaving = (state: RootState): boolean => state.products.current.color.saving;

export const selectCurrentColorStatus = (state:RootState) => state.products.current.color.status;

export const selectCurrentColorShowInactive = (state:RootState) => state.products.current.color.showInactive;
export const selectCurrentColorSort = (state:RootState) => state.products.current.color.sort;

export const selectFilteredProductColors = createSelector(
    [selectCurrentProductColors, selectCurrentColorShowInactive, selectCurrentColorSort],
    (list, showInactive, sort) => {
        return list
            .filter(c => showInactive || (c.productStatus !== 'D' && c.selfStatus))
            .sort(productColorSorter(sort))
    }
)
