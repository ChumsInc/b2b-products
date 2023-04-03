import {ColorProductUsage, ProductColor} from "b2b-types";
import {fetchColors, fetchWhereUsed, postColor} from "../../api/colorsAPI";
import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {SortProps} from "chums-components";
import {RootState} from "../../app/configureStore";
import {selectColorsStatus} from "./selectors";

export const loadColors = createAsyncThunk<ProductColor[]>(
    'colors/load',
    async () => {
        return await fetchColors();
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState
            return selectColorsStatus(state) === 'idle'
        }
    }
);


export const saveColor = createAsyncThunk<{ list: ProductColor[], color: ProductColor }, ProductColor>(
    'colors/saveColor',
    async (arg) => {
        return await postColor({...arg, code: arg.code.trim()});
    }
);


export const setCurrentColor = createAction<ProductColor | undefined>('colors/setCurrent');


export const setColorFilter = createAction<string>('colors/setFilter');

export const toggleFilterInactiveColors = createAction<boolean|undefined>('colors/toggleFilterInactive');

export const loadColorUsage = createAsyncThunk<ColorProductUsage[], number>(
    'colors/loadUsage',
    async (arg) => {
        return await fetchWhereUsed(arg);
    }
);

export const setPage = createAction<number>('colors/setPage');

export const setRowsPerPage = createAction<number>('colors/setRowsPerPage');

export const setSort = createAction<SortProps<ProductColor>>('colors/setSort');
