import {combineReducers} from "redux";
import {default as currentProductReducer} from './product/index'
import {default as currentColorReducer} from './color/index'
import {default as currentMixReducer} from './mix/index'
import {default as imagesReducer} from "./images/index";
import {default as productKeywordReducer} from "./keyword/index";

export default combineReducers({
    current: combineReducers({
        product: currentProductReducer,
        keyword: productKeywordReducer,
        color: currentColorReducer,
        mix: currentMixReducer,
        images: imagesReducer,
    })
});

