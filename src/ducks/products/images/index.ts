import {ProductAlternateImage} from "b2b-types/src/products";
import {createReducer} from "@reduxjs/toolkit";
import {loadProduct} from "../product/actions";
import {ActionStatus} from "b2b-types";
import {altImageSort, defaultAltImageSort} from "./utils";
import {loadImages, removeImage, saveImage, setCurrentImage} from "./actions";


export interface ImagesState {
    productId: number | null;
    list: ProductAlternateImage[],
    current: ProductAlternateImage | null,
    status: ActionStatus;
}

export const initialImagesState: ImagesState = {
    productId: null,
    list: [],
    current: null,
    status: 'idle',
}


const imagesReducer = createReducer(initialImagesState, (builder) => {
    builder
        .addCase(loadProduct.fulfilled, (state, action) => {
            state.productId = action.payload?.id ?? null;
            state.list = [...(action.payload?.images ?? [])].sort(altImageSort(defaultAltImageSort));
            if (state.current) {
                const [current] = state.list.filter(img => img.id === state.current?.id);
                state.current = current ?? null;
            }
        })
        .addCase(setCurrentImage, (state, action) => {
            state.current = action.payload;
        })
        .addCase(loadImages.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(loadImages.fulfilled, (state, action) => {
            state.status = 'idle';
            state.list = [...action.payload].sort(altImageSort(defaultAltImageSort));
            if (state.current) {
                const [current] = state.list.filter(img => img.id === state.current?.id);
                state.current = current ?? null;
            }
        })
        .addCase(loadImages.rejected, (state) => {
            state.status = 'idle';
        })
        .addCase(saveImage.pending, (state) => {
            state.status = 'saving';
        })
        .addCase(saveImage.fulfilled, (state, action) => {
            state.status = 'idle';
            state.list = [...action.payload].sort(altImageSort(defaultAltImageSort));
            if (state.current) {
                const [current] = state.list.filter(img => img.id === state.current?.id);
                state.current = current ?? null;
            }
        })
        .addCase(saveImage.rejected, (state) => {
            state.status = 'idle';
        })
        .addCase(removeImage.pending, (state) => {
            state.status = 'deleting';
        })
        .addCase(removeImage.fulfilled, (state, action) => {
            state.status = 'idle';
            state.list = [...action.payload].sort(altImageSort(defaultAltImageSort));
            if (state.current) {
                const [current] = state.list.filter(img => img.id === state.current?.id);
                state.current = current ?? null;
            }
        })
        .addCase(removeImage.rejected, (state) => {
            state.status = "idle";
        })
});

export default imagesReducer;
