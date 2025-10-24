import type {ActionStatus, ProductAlternateImage} from "b2b-types";
import type {SortProps} from "chums-types";
import {createEntityAdapter, createSelector, createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {loadProduct} from "@/ducks/products/actions/product-actions.ts";
import {loadImages, removeImage, saveImage} from "@/ducks/products/actions/images-actions.ts";
import {dismissAlert} from "@/ducks/alerts";
import {altImageSort} from "@/ducks/products/utils/images-utils.ts";


export interface ImagesState {
    productId: number | null;
    current: ProductAlternateImage | null,
    status: ActionStatus | 'rejected';
    showInactive: boolean;
    sort: SortProps<ProductAlternateImage>;
}

export const extraState: ImagesState = {
    productId: null,
    current: null,
    status: 'idle',
    showInactive: false,
    sort: {field: 'priority', ascending: true},
}

const adapter = createEntityAdapter<ProductAlternateImage, number>({
    selectId: (arg) => arg.id,
    sortComparer: (a, b) => a.id - b.id,
})
const selectors = adapter.getSelectors();

export const productImagesSlice = createSlice({
    name: 'productImages',
    initialState: adapter.getInitialState(extraState),
    reducers: {
        setCurrentImage: (state, action: PayloadAction<ProductAlternateImage | null>) => {
            state.current = action.payload;
        },
        setShowInactiveImages: (state, action: PayloadAction<boolean>) => {
            state.showInactive = action.payload;
        },
        setImagesSort: (state, action: PayloadAction<SortProps<ProductAlternateImage>>) => {
            state.sort = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadProduct.fulfilled, (state, action) => {
                state.productId = action.payload?.id ?? null;
                adapter.setAll(state, action.payload?.images ?? []);
                const current = action.payload?.images?.find(img => img.id === state.current?.id);
                state.current = current ?? null;
            })
            .addCase(loadImages.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loadImages.fulfilled, (state, action) => {
                state.status = 'idle';
                adapter.setAll(state, action.payload);
                const current = action.payload.find(img => img.id === state.current?.id);
                state.current = current ?? null;
            })
            .addCase(loadImages.rejected, (state) => {
                state.status = 'rejected';
            })
            .addCase(saveImage.pending, (state) => {
                state.status = 'saving';
            })
            .addCase(saveImage.fulfilled, (state, action) => {
                state.status = 'idle';
                adapter.setAll(state, action.payload);
                const current = action.payload.find(img => img.id === state.current?.id);
                state.current = current ?? null;
            })
            .addCase(saveImage.rejected, (state) => {
                state.status = 'rejected';
            })
            .addCase(removeImage.pending, (state) => {
                state.status = 'deleting';
            })
            .addCase(removeImage.fulfilled, (state, action) => {
                state.status = 'idle';
                adapter.setAll(state, action.payload);
                const current = action.payload.find(img => img.id === state.current?.id);
                state.current = current ?? null;
            })
            .addCase(removeImage.rejected, (state) => {
                state.status = "rejected";
            })
            .addCase(dismissAlert, (state, action) => {
                if (action.payload.context && [loadImages.typePrefix, saveImage.typePrefix, removeImage.typePrefix].includes(action.payload.context)) {
                    state.status = 'idle';
                }
            })
    },
    selectors: {
        selectImages: (state) => selectors.selectAll(state),
        selectCurrentImage: (state) => state.current,
        selectImagesStatus: (state) => state.status,
        selectShowInactiveImages: (state) => state.showInactive,
        selectImagesSort: (state) => state.sort,
    }
})

export const {
    setCurrentImage,
    setShowInactiveImages,
    setImagesSort,
} = productImagesSlice.actions;
export const {
    selectImages,
    selectCurrentImage,
    selectImagesStatus,
    selectShowInactiveImages,
    selectImagesSort,
} = productImagesSlice.selectors;

export const selectSortedImages = createSelector(
    [selectImages, selectShowInactiveImages, selectImagesSort],
    (images, showInactive, sort) => images
        .filter(img => showInactive || img.status)
        .sort(altImageSort(sort))
);

