import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {ProductAlternateImage} from "b2b-types/src/products";
import {deleteAltImage, fetchAltImages, postAltImage} from "./api";

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
