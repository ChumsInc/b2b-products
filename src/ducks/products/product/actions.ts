import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {
    deleteVariant,
    fetchProduct,
    postProduct,
    postVariant,
    putDefaultVariant
} from "../../../api/productsAPI";
import {ProductVariant, Product, ProductAdditionalData} from "b2b-types";


export const setNewProduct = createAction('products/current/new');

export const duplicateProduct = createAction('products/current/duplicate');

export const updateProduct = createAction<Partial<Product>>('products/current/update');

export const updateProductAdditionalData = createAction<Partial<ProductAdditionalData>>('products/current/updateAdditionalData');

export const loadProduct = createAsyncThunk<Product|null, string>(
    'product/current/load',
    async (arg, thunkApi) => {
        return fetchProduct(arg);
    }
)

export const saveProduct = createAsyncThunk<Product, Product>(
    'product/current/save',
    async (arg, thunkApi) => {
        return postProduct(arg);
    }
)
