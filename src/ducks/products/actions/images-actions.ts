import {createAsyncThunk} from "@reduxjs/toolkit";
import type {ProductAlternateImage} from "b2b-types";
import {deleteAltImage, fetchAltImages, postAltImage} from "../api/images-api.ts";

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
