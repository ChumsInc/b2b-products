import {createAsyncThunk} from "@reduxjs/toolkit";
import type {ProductColorItem} from "b2b-types";
import {deleteColorItem, postColorItem} from "../api/color-item-api.ts";
import {selectColorByCode} from "../../colors/selectors.ts";
import {type RootState} from "@/app/configureStore.ts";

export const saveCurrentColorItem = createAsyncThunk<ProductColorItem[], ProductColorItem>(
    'products/current/colors/saveItem',
    async (arg, {getState}) => {
        const color = selectColorByCode(getState() as RootState, arg.colorCode);
        if (!color) {
            return Promise.reject(new Error('Invalid Color Code'));
        }
        return await postColorItem({...arg, color, colorsId: color.id, colorName: color.name});
    }
)

export const removeColorItem = createAsyncThunk<ProductColorItem[], ProductColorItem>(
    'products/current/colors/deleteItem',
    async (arg) => {
        return await deleteColorItem(arg);
    }
)
