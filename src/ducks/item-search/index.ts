import {combineReducers} from "redux";
import {ActionInterface, ActionPayload} from "chums-ducks";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../../app/configureStore";
import {apiActionHelper} from "../utils";
import {loadItemSearchAPI} from "../../api/item-searchAPI";
import {ItemSearchFilter, ItemSearchList, ItemSearchRecord} from "../../types/item-search";

export interface ItemSearchPayload extends ActionPayload {
    list: ItemSearchList
}

export interface ItemSearchAction extends ActionInterface {
    payload: ItemSearchPayload,
}

export interface ItemSearchThunkAction extends ThunkAction<any, RootState, unknown, ItemSearchAction> {
}

export const loadItemSearch = 'item-search/load';
const [loadItemSearchPending, loadItemSearchResolved, loadItemSearchRejected] = apiActionHelper(loadItemSearch);

export const selectItemSearchList = (state:RootState):ItemSearchList => state.itemSearch.list;
export const selectItemSearchLoading = (state:RootState):boolean => state.itemSearch.loading;

export const itemSearchAction = (search: string, filter?: ItemSearchFilter, signal?: AbortSignal): ItemSearchThunkAction =>
    async (dispatch, getState) => {
        try {
            const items = await loadItemSearchAPI(search, filter, signal);
            const list:ItemSearchList = {};

            items
                .map(i => ({...i, LabelKey: `${i.ItemCode} - ${i.ItemCodeDesc}`}))
                .forEach(i => list[i.ItemCode] = i);
            dispatch({type: loadItemSearchResolved, payload: {list, clearContext: loadItemSearch}});
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("itemSearchAction()", error.message);
                return dispatch({type: loadItemSearchRejected, payload: {error, list: {}, context: loadItemSearch}});
            }
            console.error("itemSearchAction()", error);
        }
    }

const listReducer = (state: ItemSearchList = {}, action: ItemSearchAction): ItemSearchList => {
    const {type, payload} = action;
    switch (type) {
    case loadItemSearchResolved:
        return {...payload.list};
    default:
        return state;
    }
}

const loadingReducer = (state: boolean = false, action: ItemSearchAction): boolean => {
    const {type, payload} = action;
    switch (type) {
    case loadItemSearchPending:
        return true;
    case loadItemSearchResolved:
    case loadItemSearchRejected:
        return false;
    default:
        return state;
    }
}
export default combineReducers({
    list: listReducer,
    loading: loadingReducer,
})
