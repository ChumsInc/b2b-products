import {combineReducers} from "redux";
import {ColorProductSorterProps, ColorSorterProps, EditableProductColor} from "../../types/product";
import {ColorProductUsage, ProductColor} from "b2b-types";
import {colorProductUsageSorter, colorSorter} from "./sorter";
import {
    ColorAction,
    loadColorsPending,
    loadColorsRejected,
    loadColorsResolved,
    loadUsagePending,
    loadUsageResolved,
    saveColorPending,
    saveColorRejected,
    saveColorResolved,
    setColorFilter,
    setCurrentColor,
    updateCurrentColor
} from "./actionTypes";


export const colorListTableKey = 'color-list';

export const emptyColor: ProductColor = {
    id: 0,
    code: '',
    name: '',
}


const defaultColorSort: ColorSorterProps = {
    field: 'id',
    ascending: true,
}

const defaultColorProductUsageSort: ColorProductSorterProps = {
    field: 'itemCode',
    ascending: true,
}

export interface ProductColorList {
    [key:string]: ProductColor,
}

const listReducer = (state: ProductColorList = {}, action: ColorAction): ProductColorList => {
    const {type, payload} = action;
    switch (type) {
    case loadColorsResolved:
    case saveColorResolved:
        if (payload?.list) {
            const nextState:ProductColorList = {};
            payload.list.forEach(c => nextState[c.code] = c);
            return nextState;
        }
        return state;
    default:
        return state;
    }
}

const loadingReducer = (state: boolean = false, action: ColorAction): boolean => {
    const {type, payload} = action;
    switch (type) {
    case loadColorsPending:
        return true;
    case loadColorsResolved:
    case loadColorsRejected:
        return false;
    default:
        return state;
    }
}

const savingReducer = (state: boolean = false, action: ColorAction): boolean => {
    const {type, payload} = action;
    switch (type) {
    case saveColorPending:
        return true;
    case saveColorResolved:
    case saveColorRejected:
        return false;
    default:
        return state;
    }
}

const currentReducer = (state: EditableProductColor = emptyColor, action: ColorAction): EditableProductColor => {
    const {type, payload} = action;
    switch (type) {
    case setCurrentColor:
    case saveColorResolved:
    case loadColorsResolved:
        if (payload?.color) {
            return {...payload.color};
        }
        return {...emptyColor};
    case updateCurrentColor:
        if (payload?.props) {
            return {...state, ...payload.props, changed: true,}
        }
        return state;
    default:
        return state;
    }
}

const filterReducer = (state: string = '', action: ColorAction): string => {
    const {type, payload} = action;
    switch (type) {
    case setColorFilter:
        return payload?.value || '';
    default:
        return state;
    }
}

const whereUsedReducer = (state: ColorProductUsage[] = [], action: ColorAction): ColorProductUsage[] => {
    const {type, payload} = action;
    switch (type) {
    case loadUsagePending:
        return [];
    case loadUsageResolved:
        if (payload?.items) {
            return [...payload.items.sort(colorProductUsageSorter(defaultColorProductUsageSort))];
        }
        return state;
    default:
        return state;
    }
}

export default combineReducers({
    list: listReducer,
    loading: loadingReducer,
    saving: savingReducer,
    current: currentReducer,
    filter: filterReducer,
    whereUsed: whereUsedReducer,
})
