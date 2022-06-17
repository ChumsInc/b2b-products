import {RootState} from "../../app/configureStore";
import {colorSorter} from "./sorter";
import {createSelector} from "reselect";
import {filterPage, selectCurrentPage, selectRowsPerPage, selectTableSort} from "chums-ducks";
import {colorListTableKey} from "./index";
import {ColorSorterProps} from "../../types/product";
import {defaultColor} from "../../defaults";
import {ProductColor} from "b2b-types/src/products";

export const selectColorList = (state: RootState) => Object.values(state.colors.list);
export const selectColorListLength = (state:RootState) => Object.keys(state.colors.list).length;
export const selectColorsLoading = (state: RootState) => state.colors.loading;
export const selectColorSaving = (state: RootState) => state.colors.saving;
export const selectCurrentColor = (state: RootState) => state.colors.current;
export const selectSortedColorList = (sort: ColorSorterProps) => (state: RootState) => selectColorList(state).sort(colorSorter(sort));
export const selectColorFilter = (state:RootState) => state.colors.filter;
export const selectColorByCode = (code: string) => (state:RootState):ProductColor => state.colors.list[code] || {...defaultColor};

export const selectFilteredList = createSelector(
    [selectColorList, selectColorFilter],
    (list, filter) => {
        let reFilter:RegExp = /^/;
        try {
            reFilter = new RegExp(filter, 'i');
        } catch(err:unknown) {}
        return list
            .filter(color => !filter || reFilter.test(color.code) || reFilter.test(color.name || ''));
    }
)
export const selectFilteredListLength = createSelector([selectFilteredList], (list) => list.length);

export const selectSortedList = createSelector(
    [selectFilteredList, selectTableSort(colorListTableKey), selectRowsPerPage(colorListTableKey), selectCurrentPage(colorListTableKey)],
    (list, sort, rowsPerPage, page) => {
        return list
            .sort(colorSorter(sort as ColorSorterProps))
            .filter(filterPage(page, rowsPerPage));
    });

export const selectWhereUsed = (state:RootState) => state.colors.whereUsed;
