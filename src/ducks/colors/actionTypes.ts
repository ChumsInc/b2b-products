import {apiActionHelper} from "../utils";
import {ActionInterface, ActionPayload} from "chums-connected-components";
import {ColorProductUsage, ProductColor} from "b2b-types";

export interface ColorPayload extends ActionPayload {
    list?: ProductColor[],
    color?: ProductColor,
    props?: Partial<ProductColor>,
    value?: string,
    items?: ColorProductUsage[],
}

export interface ColorAction extends ActionInterface {
    payload?: ColorPayload,
}

export const loadColors = 'colors/load';
export const loadUsage = 'colors/loadUsage';
export const saveColor = 'colors/save';
export const setCurrentColor = 'colors/current';
export const updateCurrentColor = 'colors/currentUpdated';
export const setColorFilter = 'colors/setFilter';

export const [loadColorsPending, loadColorsResolved, loadColorsRejected] = apiActionHelper(loadColors);
export const [loadUsagePending, loadUsageResolved, loadUsageRejected] = apiActionHelper(loadUsage);
export const [saveColorPending, saveColorResolved, saveColorRejected] = apiActionHelper(saveColor);
