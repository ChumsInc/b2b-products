import {ColorProductUsage, ProductColor} from "b2b-types";
import {fetchColors, fetchWhereUsed, postColor} from "../../api/colorsAPI";
import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {SortProps} from "chums-components";
import {RootState} from "../../app/configureStore";
import {selectColorsLoading, selectColorsStatus, selectColorUsageLoading} from "./selectors";

export const loadColors = createAsyncThunk<ProductColor[]>(
    'colors/list/=load',
    async () => {
        return await fetchColors();
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState
            return !selectColorsLoading(state);
        }
    }
);


export const saveColor = createAsyncThunk<{ list: ProductColor[], color: ProductColor }, ProductColor>(
    'colors/current/save',
    async (arg) => {
        return await postColor({...arg, code: arg.code.trim()});
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return selectColorsStatus(state) === 'idle'
                && !!arg.code.trim()
                && arg.code.toLowerCase() !== 'new';
        }
    }
);


export const setCurrentColor = createAction<ProductColor | undefined>('colors/current/set');

export const setCurrentColorByCode = createAction<string | undefined>('colors/current/code');


export const setColorFilter = createAction<string>('colors/setFilter');

export const toggleFilterInactiveColors = createAction<boolean | undefined>('colors/list/toggleFilterInactive');

export const loadColorUsage = createAsyncThunk<ColorProductUsage[], number>(
    'colors/loadUsage',
    async (arg) => {
        return await fetchWhereUsed(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!arg && !selectColorUsageLoading(state);
        }
    }
);

export const setSort = createAction<SortProps<ProductColor>>('colors/list/setSort');
