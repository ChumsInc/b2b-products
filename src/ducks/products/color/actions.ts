import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {ProductColorItem} from "b2b-types";
import {deleteColorItem, postColorItem} from "./api";
import {selectColorByCode} from "../../colors/selectors";
import {RootState} from "../../../app/configureStore";
import {SortProps} from "chums-types";

export const setCurrentColorItem = createAction<ProductColorItem | null>('products/current/colors/setItem');

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

export const setColorsSort = createAction<SortProps<ProductColorItem>>('products/current/colors/setSort');
export const setColorsShowInactive = createAction<boolean>('products/current/colors/setShowInactiveImages');
