import {ActionStatus, ColorProductUsage, ProductColor} from "b2b-types";
import {colorProductUsageSorter} from "./sorter";
import {SortProps} from "chums-components";
import {getPreference, localStorageKeys, setPreference} from "../../api/preferences";
import {createReducer} from "@reduxjs/toolkit";
import {
    loadColors,
    loadColorUsage,
    saveColor,
    setColorFilter,
    setCurrentColor,
    setPage,
    setRowsPerPage,
    setSort,
    toggleFilterInactiveColors
} from "./actions";

const defaultColorSort: SortProps<ProductColor> = {
    field: 'id',
    ascending: true,
}

const defaultColorProductUsageSort: SortProps<ColorProductUsage> = {
    field: 'itemCode',
    ascending: true,
}

export interface ProductColorList {
    [key: string]: ProductColor,
}

export interface ColorsState {
    list: ProductColorList,
    status: ActionStatus;
    current: ProductColor | null;
    filter: string;
    filterInactive: boolean;
    whereUsed: {
        list: ColorProductUsage[];
        status: ActionStatus;
    };
    sort: SortProps<ProductColor>;
    page: number;
    rowsPerPage: number;
}

export const initialColorsState: ColorsState = {
    list: {},
    status: 'idle',
    current: null,
    filter: '',
    filterInactive: true,
    whereUsed: {
        list: [],
        status: 'idle',
    },
    sort: {...defaultColorSort},
    page: 0,
    rowsPerPage: getPreference(localStorageKeys.colors.rowsPerPage, 25),
}
export const colorListTableKey = 'color-list';

const colorsReducer = createReducer(initialColorsState, (builder) => {
    builder
        .addCase(loadColors.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(loadColors.fulfilled, (state, action) => {
            state.status = 'idle';
            state.list = {};
            action.payload.forEach(color => {
                state.list[color.code] = color;
            })
            if (state.current) {
                const [color] = action.payload.filter(color => color.id === state.current?.id);
                state.current = color ?? null;
            }
            if (state.page > (Object.keys(action.payload).length % state.rowsPerPage)) {
                state.page = 0;
            }
        })
        .addCase(loadColors.rejected, (state) => {
            state.status = 'idle';
        })
        .addCase(saveColor.pending, (state) => {
            state.status = 'saving';
        })
        .addCase(saveColor.fulfilled, (state, action) => {
            state.list = {};
            action.payload.list.forEach(color => {
                state.list[color.code] = color;
            });
            state.current = action.payload.color;
            state.status = 'idle';

            if (state.page > (Object.keys(action.payload).length % state.rowsPerPage)) {
                state.page = 0;
            }
        })
        .addCase(saveColor.rejected, (state) => {
            state.status = 'idle';
        })
        .addCase(setCurrentColor, (state, action) => {
            state.current = action.payload ?? null;
            state.whereUsed.list = [];
        })
        .addCase(setColorFilter, (state, action) => {
            state.filter = action.payload;
            state.page = 0;
        })
        .addCase(toggleFilterInactiveColors, (state, action) => {
            state.filterInactive = action.payload ?? !state.filterInactive;
        })
        .addCase(loadColorUsage.pending, (state) => {
            state.whereUsed.status = 'loading';
        })
        .addCase(loadColorUsage.fulfilled, (state, action) => {
            state.whereUsed.list = action.payload.sort(colorProductUsageSorter(defaultColorProductUsageSort));
            state.whereUsed.status = 'idle';
        })
        .addCase(loadColorUsage.rejected, (state) => {
            state.whereUsed.status = 'idle';
        })
        .addCase(setPage, (state, action) => {
            state.page = action.payload;
        })
        .addCase(setRowsPerPage, (state, action) => {
            setPreference(localStorageKeys.colors.rowsPerPage, action.payload);
            state.rowsPerPage = action.payload;
            state.page = 0;
        })
        .addCase(setSort, (state, action) => {
            state.page = 0;
            state.sort = action.payload;
        })
})


export default colorsReducer;
