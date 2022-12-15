import {ProductAlternateImage} from "b2b-types/src/products";
import {createAction, createAsyncThunk, createReducer} from "@reduxjs/toolkit";
import {loadProduct} from "../product/actions";
import {RootState} from "../../../app/configureStore";
import {deleteAltImage, fetchAltImages, postAltImage} from "../../../api/productsAPI";
import {ActionStatus} from "b2b-types";
import {SortProps} from "chums-components";



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

export const setCurrentImage = createAction<ProductAlternateImage | null>('products/current/images/setCurrentImage');

export const loadImages = createAsyncThunk<ProductAlternateImage[], number>(
    'products/current/images/loadImages',
    async (arg) => {
        return await fetchAltImages(arg);
    }
)

export const saveImage = createAsyncThunk<ProductAlternateImage[], ProductAlternateImage>(
    'products/current/images/saveImage',
    async (arg) => {
        return await postAltImage(arg);
    }
)

export const removeImage = createAsyncThunk<ProductAlternateImage[], ProductAlternateImage>(
    'products/current/images/removeImage',
    async (arg) => {
        return await deleteAltImage(arg);
    }
)



export const selectImages = (state: RootState) => state.products.current.images.list;

export const selectCurrentImage = (state:RootState) => state.products.current.images.current;

export const selectImageSaving = (state:RootState) => state.products.current.images.status === 'saving';

export const selectImagesStatus = (state:RootState) => state.products.current.images.status;

export const defaultAltImageSort:SortProps<ProductAlternateImage> = {field: 'altText', ascending: true};

export const altImageSort = (sort:SortProps<ProductAlternateImage>) => (a:ProductAlternateImage, b:ProductAlternateImage) => {
    const sortMod = sort.ascending ? 1 : -1;
    switch (sort.field) {
    case 'altText':
    case 'image':
        return (a[sort.field].toLowerCase() === b[sort.field].toLowerCase()
            ? (a.priority === b.priority ? a.id - b.id : a.priority - b.priority)
            : (a[sort.field].toLowerCase() > b[sort.field].toLowerCase() ? 1 : -1)) * sortMod;
    case 'priority':
        return (a.priority === b.priority ? a.id - b.id : (a.priority - b.priority)) * sortMod;
    default:
        return a.id - b.id;
    }
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
        .addCase(saveImage.rejected,  (state) => {
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
