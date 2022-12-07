import {RootState} from "../../app/configureStore";
import {colorSorter} from "./sorter";
import {createSelector} from "reselect";
import {ColorSorterProps} from "../../types/product";
import {ProductColor} from "b2b-types/src/products";


export const selectColorList = (state: RootState) => state.colors.list;

export const selectColorListLength = (state: RootState) => Object.keys(state.colors.list).length;

export const selectColorsLoading = (state: RootState) => state.colors.loading;

export const selectColorSaving = (state: RootState) => state.colors.saving;

export const selectCurrentColor = (state: RootState) => state.colors.current;

export const selectColorFilter = (state: RootState) => state.colors.filter;

export const selectColorsFilterInactive = (state:RootState) => state.colors.filterInactive;

export const selectColorCode = (state: RootState, code: string) => code;

export const selectPage = (state: RootState) => state.colors.page;

export const selectRowsPerPage = (state: RootState) => state.colors.rowsPerPage;

export const selectSort = (state: RootState) => state.colors.sort;

export const selectColorByCode = createSelector(
    [selectColorList, selectColorCode],
    (list, code): ProductColor => list[code] ?? null
);

export const selectFilteredList = createSelector(
    [selectColorList, selectColorsFilterInactive, selectColorFilter],
    (list, filterInactive, filter) => {
        let reFilter: RegExp = /^/;
        try {
            reFilter = new RegExp(filter, 'i');
        } catch (err: unknown) {
        }
        return Object.values(list)
            .filter(color => !filterInactive || color.active)
            .filter(color => !filter || reFilter.test(color.code) || reFilter.test(color.name || ''));
    }
)
export const selectFilteredListLength = createSelector([selectFilteredList], (list) => list.length);

export const selectSortedList = createSelector(
    [selectFilteredList, selectSort, selectRowsPerPage, selectPage],
    (list, sort, rowsPerPage, page) => {
        return [...list]
            .sort(colorSorter(sort as ColorSorterProps))
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    });

export const selectWhereUsed = (state: RootState) => state.colors.whereUsed.list;
