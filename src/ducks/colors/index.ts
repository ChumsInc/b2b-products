import {ColorProductUsage, ProductColor} from "b2b-types";
import {colorProductUsageSorter} from "./sorter";
import {SortProps} from "chums-components";
import {getPreference, localStorageKeys, setPreference} from "../../api/preferences";
import {createReducer} from "@reduxjs/toolkit";
import {
    loadColors,
    loadColorUsage,
    saveColor,
    setColorFilter,
    setCurrentColor, setPage, setRowsPerPage, setSort, toggleFilterInactiveColors
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
    loading: boolean;
    saving: boolean;
    current: ProductColor | null;
    filter: string;
    filterInactive: boolean;
    whereUsed: {
        list: ColorProductUsage[];
        loading: boolean;
    };
    sort: SortProps<ProductColor>;
    page: number;
    rowsPerPage: number;
}

export const initialColorsState: ColorsState = {
    list: {},
    loading: false,
    saving: false,
    current: null,
    filter: '',
    filterInactive: true,
    whereUsed: {
        list: [],
        loading: false,
    },
    sort: {...defaultColorSort},
    page: 0,
    rowsPerPage: getPreference(localStorageKeys.colors.rowsPerPage, 25),
}
export const colorListTableKey = 'color-list';

const colorsReducer = createReducer(initialColorsState, (builder) => {
    builder
        .addCase(loadColors.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadColors.fulfilled, (state, action) => {
            state.loading = false;
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
            state.loading = false;
        })
        .addCase(saveColor.pending, (state) => {
            state.saving = true;
        })
        .addCase(saveColor.fulfilled, (state, action) => {
            state.list = {};
            action.payload.list.forEach(color => {
                state.list[color.code] = color;
            });
            state.current = action.payload.color;
            state.saving = false;

            if (state.page > (Object.keys(action.payload).length % state.rowsPerPage)) {
                state.page = 0;
            }
        })
        .addCase(saveColor.rejected, (state) => {
            state.saving = false;
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
            state.whereUsed.loading = true;
        })
        .addCase(loadColorUsage.fulfilled, (state, action) => {
            state.whereUsed.list = action.payload.sort(colorProductUsageSorter(defaultColorProductUsageSort));
            state.whereUsed.loading = false;
        })
        .addCase(loadColorUsage.rejected, (state) => {
            state.whereUsed.loading = false;
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
