import {ProductColor} from "b2b-types";
import {fetchColors, fetchWhereUsed, postColor} from "../../api/colorsAPI";
import {emptyColor} from "./index";
import {selectColorList, selectColorSaving, selectColorsLoading, selectCurrentColor} from "./selectors";
import {
    ColorAction,
    loadColors,
    loadColorsPending,
    loadColorsRejected,
    loadColorsResolved, loadUsage, loadUsagePending, loadUsageRejected, loadUsageResolved, saveColor,
    saveColorPending,
    saveColorResolved, setColorFilter, setCurrentColor, updateCurrentColor
} from "./actionTypes";
import Debug from "debug";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../../app/configureStore";
const debug = Debug('chums:api:colorAPI');

export interface ColorThunkAction extends ThunkAction<any, RootState, unknown, ColorAction> {
}


const filterCurrentColor = (list: ProductColor[], current: ProductColor) => {
    let color: ProductColor = {...emptyColor};
    if (current.id) {
        [color] = list.filter(c => c.id === current.id);
    } else if (!!current.code) {
        [color] = list.filter(c => c.code === current.code.trim());
    }
    return color;
}

export const loadColorsAction = (): ColorThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectColorsLoading(state) || selectColorSaving(state)) {
                return;
            }
            dispatch({type: loadColorsPending});
            const list = await fetchColors();
            const color = filterCurrentColor(list, selectCurrentColor(state));
            dispatch({type: loadColorsResolved, payload: {list, color}});
        } catch (err: unknown) {
            if (err instanceof Error) {
                debug("loadColorsAction()", err.message);
                return dispatch({type: loadColorsRejected, payload: {error: err, context: loadColors}});
            }
            debug("loadColorsAction()", err);
        }
    }

export const saveColorAction = (): ColorThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectColorsLoading(state) || selectColorSaving(state)) {
                return;
            }
            const current = selectCurrentColor(state);
            if (!current.id && !current.code.trim()) {
                return;
            }
            dispatch({type: saveColorPending});
            const {list, color} = await postColor({...current, code: current.code.trim()});
            dispatch({type: saveColorResolved, payload: {list, color}});
        } catch (err: unknown) {
            if (err instanceof Error) {
                debug("loadColorsAction()", err.message);
                return dispatch({type: loadColorsRejected, payload: {error: err, context: saveColor}});
            }
            debug("loadColorsAction()", err);
        }
    }

export const setCurrentByIdAction = (id: number): ColorThunkAction =>
    (dispatch, getState) => {
        const state = getState();
        const [color = {...emptyColor}] = selectColorList(state).filter(c => c.id === id);
        dispatch({type: setCurrentColor, payload: {color}});
    }

export const setCurrentColorAction = (color?: ProductColor): ColorAction => ({type: setCurrentColor, payload: {color}});

export const updateCurrentColorAction = (props: Partial<ProductColor>): ColorAction => ({
    type: updateCurrentColor,
    payload: {props}
});

export const setColorFilterAction = (value:string):ColorAction => ({type: setColorFilter, payload: {value}});

export const loadColorUsageAction = (id: number):ColorThunkAction =>
    async (dispatch, getState) => {
    try {
        if (!id) {
            return;
        }
        dispatch({type: loadUsagePending});
        const items = await fetchWhereUsed(id);
        dispatch({type: loadUsageResolved, payload: {items}});
    } catch(error:unknown) {
        if (error instanceof Error) {
            console.log("loadColorUsageAction()", error.message);
            return dispatch({type:loadUsageRejected, payload: {error, context: loadUsage}})
        }
        console.error("loadColorUsageAction()", error);
    }
}
