import {combineReducers} from "redux";
import {default as currentProductReducer} from './product/index'
import {default as currentVariantReducer} from './variant/index'
import {default as currentColorReducer} from './color/index'
import {default as currentMixReducer} from './mix/index'
import {default as listReducer} from './list/index'
import imagesReducer from "./images";

export default combineReducers({
    list: listReducer,
    current: combineReducers({
        product: currentProductReducer,
        variant: currentVariantReducer,
        color: currentColorReducer,
        mix: currentMixReducer,
        images: imagesReducer,
    })
});

