import {RootState} from "../../app/configureStore";
import {colorSorter} from "./sorter";
import {createSelector} from "@reduxjs/toolkit";


export const selectColorList = (state: RootState) => state.colors.list.colors;
export const selectColorsLoading = (state: RootState) => state.colors.list.loading;
export const selectColorFilter = (state: RootState) => state.colors.list.filter;
export const selectColorsFilterInactive = (state: RootState) => state.colors.list.filterInactive;
export const selectSort = (state: RootState) => state.colors.list.sort;

export const selectCurrentColorCode = (state: RootState) => state.colors.current.code;
export const selectCurrentColor = (state: RootState) => state.colors.current.color;
export const selectColorsStatus = (state: RootState) => state.colors.current.status;
export const selectWhereUsed = (state: RootState) => state.colors.current.whereUsed.list;
export const selectColorUsageLoading = (state: RootState) => state.colors.current.whereUsed.loading

export const selectColorByCode = (state: RootState, code: string) => state.colors.list.colors[code] ?? null;

export const selectSortedList = createSelector(
    [selectColorList, selectColorsFilterInactive, selectColorFilter, selectSort],
    (list, filterInactive, filter, sort) => {
        let reFilter: RegExp = /^/;
        try {
            reFilter = new RegExp(filter, 'i');
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err: unknown) { /* empty */ }
        return Object.values(list)
            .filter(color => !filterInactive || color.active)
            .filter(color => !filter || reFilter.test(color.code) || reFilter.test(color.name || ''))
            .sort(colorSorter(sort));
    });


