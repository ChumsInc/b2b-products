import type {ActionStatus, ColorProductUsage, ProductColor} from "b2b-types";
import {colorProductUsageSorter} from "./sorter";
import type {SortProps} from "chums-types";
import {createReducer} from "@reduxjs/toolkit";
import {
    loadColors,
    loadColorUsage,
    saveColor,
    setColorFilter,
    setCurrentColor,
    setCurrentColorByCode,
    setSort,
    toggleFilterInactiveColors
} from "./actions";
import type {ProductColorList} from "@/types/product-colors";

const defaultColorSort: SortProps<ProductColor> = {
    field: 'id',
    ascending: true,
}

const defaultColorProductUsageSort: SortProps<ColorProductUsage> = {
    field: 'itemCode',
    ascending: true,
}


export interface ColorsState {
    list: {
        colors: ProductColorList;
        loading: boolean;
        filter: string;
        filterInactive: boolean;
        sort: SortProps<ProductColor>;
    },
    current: {
        code: string;
        color: ProductColor | null;
        status: ActionStatus;
        whereUsed: {
            list: ColorProductUsage[];
            loading: boolean;
        };
    }
}

export const initialColorsState: ColorsState = {
    list: {
        colors: {},
        loading: false,
        filter: '',
        filterInactive: true,
        sort: {...defaultColorSort},
    },
    current: {
        code: '',
        color: null,
        status: "idle",
        whereUsed: {
            list: [],
            loading: false,
        },
    }
}

const colorsReducer = createReducer(initialColorsState, (builder) => {
    builder
        .addCase(loadColors.pending, (state) => {
            state.list.loading = true;
        })
        .addCase(loadColors.fulfilled, (state, action) => {
            state.list.loading = false;
            state.list.colors = {};
            action.payload.forEach(color => {
                state.list.colors[color.code] = color;
            })
            state.current.color = state.list.colors[state.current.code] ?? null;
        })
        .addCase(loadColors.rejected, (state) => {
            state.list.loading = false
        })
        .addCase(saveColor.pending, (state) => {
            state.current.status = 'saving';
        })
        .addCase(saveColor.fulfilled, (state, action) => {
            state.list.colors = {};
            action.payload.list.forEach(color => {
                state.list.colors[color.code] = color;
            });
            state.current.color = state.list.colors[state.current.code] ?? null;
            state.current.status = 'idle';
        })
        .addCase(saveColor.rejected, (state) => {
            state.current.status = 'idle';
        })
        .addCase(setCurrentColor, (state, action) => {
            state.current.color = action.payload ?? null;
            state.current.whereUsed.list = [];
        })
        .addCase(setColorFilter, (state, action) => {
            state.list.filter = action.payload;
        })
        .addCase(toggleFilterInactiveColors, (state, action) => {
            state.list.filterInactive = action.payload ?? !state.list.filterInactive;
        })
        .addCase(loadColorUsage.pending, (state) => {
            state.current.whereUsed.loading = true;
        })
        .addCase(loadColorUsage.fulfilled, (state, action) => {
            state.current.whereUsed.list = action.payload.sort(colorProductUsageSorter(defaultColorProductUsageSort));
            state.current.whereUsed.loading = false
        })
        .addCase(loadColorUsage.rejected, (state) => {
            state.current.whereUsed.loading = false;
        })
        .addCase(setSort, (state, action) => {
            state.list.sort = action.payload;
        })
        .addCase(setCurrentColorByCode, (state, action) => {
            state.current.code = action.payload ?? '';
            state.current.color = state.list.colors[action.payload ?? ''] ?? null;
        })
})


export default colorsReducer;
