import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {fetchProduct, postProduct} from "../../../api/productsAPI";
import {Product, ProductAdditionalData} from "b2b-types";
import {RootState} from "../../../app/configureStore";
import {selectCurrentProductLoading, selectCurrentProductSaving} from "./selectors";


export const setNewProduct = createAction('products/current/new');

export const duplicateProduct = createAction('products/current/duplicate');

export const updateProduct = createAction<Partial<Product>>('products/current/update');

export const updateProductAdditionalData = createAction<Partial<ProductAdditionalData>>('products/current/updateAdditionalData');

export const loadProduct = createAsyncThunk<Product | null, string>(
    'product/current/load',
    async (arg) => {
        return fetchProduct(arg);
    }
)

export const saveProduct = createAsyncThunk<Product, Product>(
    'product/current/save',
    async (arg) => {
        return postProduct(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg.keyword
                && !selectCurrentProductLoading(state)
                && !selectCurrentProductSaving(state);
        }
    }
)


