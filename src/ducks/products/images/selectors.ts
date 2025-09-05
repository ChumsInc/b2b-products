import {RootState} from "../../../app/configureStore";
import {createSelector} from "@reduxjs/toolkit";
import {altImageSort} from "@/ducks/products/images/utils";

export const selectImages = (state: RootState) => state.products.current.images.list;
export const selectCurrentImage = (state:RootState) => state.products.current.images.current;
export const selectImageSaving = (state:RootState) => state.products.current.images.status === 'saving';
export const selectImagesStatus = (state:RootState) => state.products.current.images.status;
export const selectShowInactiveImages = (state:RootState) => state.products.current.images.showInactive;
export const selectImagesSort = (state:RootState) => state.products.current.images.sort;


export const selectSortedImages = createSelector(
    [selectImages, selectShowInactiveImages, selectImagesSort],
    (images, showInactive, sort) => images
        .filter(img => showInactive || img.status)
        .sort(altImageSort(sort))
);

