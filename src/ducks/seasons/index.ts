import {ProductSeason} from "b2b-types";
import {ActionInterface, ActionPayload, dateFromInputValue, dismissContextAlertAction} from "chums-ducks";
import {apiActionHelper} from "../utils";
import {combineReducers} from "redux";
import {RootState} from "../../app/configureStore";
import {ThunkAction} from "redux-thunk";
import {fetchSeasons} from "../../api/seasonsAPI";
import {ProductSeasonList} from "../../types/product";

export interface SeasonPayload  extends ActionPayload {
    list?: ProductSeason[],
}
export interface SeasonAction extends ActionInterface {
    payload?: SeasonPayload
}
export interface SeasonsThunkAction extends ThunkAction<any, RootState, unknown, SeasonAction> {}

const loadSeasons = 'loadSeasons';
export const [loadSeasonsPending, loadSeasonsResolved, loadSeasonsRejected] = apiActionHelper(loadSeasons);

export const selectSeasons = (state:RootState) => state.seasons.list;
export const selectSeasonsLoading = (state:RootState) => state.seasons.loading;

export const loadSeasonsAction = ():SeasonsThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectSeasonsLoading(state)) {
                return;
            }
            dispatch({type: loadSeasonsPending});
            const seasons = await  fetchSeasons();
            dispatch({type: loadSeasonsResolved, payload: {list: seasons}});
            dispatch(dismissContextAlertAction(loadSeasons));
        } catch(err:unknown) {
            if (err instanceof Error) {
                dispatch({type: loadSeasonsRejected, payload: {error: err, context: loadSeasons}});
            }
            console.debug("()", err);
            return Promise.reject(new Error('Error in ()'));
        }
}

const listReducer = (state: ProductSeasonList = {}, action: SeasonAction): ProductSeasonList => {
    const {type, payload} = action;
    switch (type) {
    case loadSeasonsResolved:
        if (payload?.list) {
            const list:ProductSeasonList = {};
            payload.list.forEach(s => list[s.code] = s);
            return list;
        }
        return state;
    default:
        return state;
    }
}

const loadingReducer = (state: boolean = false, action: SeasonAction): boolean => {
    const {type, payload} = action;
    switch (type) {
    case loadSeasonsPending:
        return true;
    case loadSeasonsResolved:
    case loadSeasonsRejected:
        return false;
    default:
        return state;
    }
}

export default combineReducers({
    list: listReducer,
    loading: loadingReducer,
})
