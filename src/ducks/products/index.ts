import {combineReducers} from "redux";
import {default as currentProductReducer} from './product/index'
import {default as currentVariantReducer} from './variant/index'
import {default as currentColorReducer} from './color/index'
import {default as currentMixReducer} from './mix/index'
import {default as listReducer} from './list/index'
import {default as imagesReducer} from "./images/index";
import {default as productKeywordReducer} from "./keyword/index";

export default combineReducers({
    list: listReducer,
    current: combineReducers({
        product: currentProductReducer,
        keyword: productKeywordReducer,
        variant: currentVariantReducer,
        color: currentColorReducer,
        mix: currentMixReducer,
        images: imagesReducer,
    })
});

