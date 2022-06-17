import {combineReducers} from "redux";
import {default as currentProductReducer} from './currentProductReducer'
import {default as currentVariantReducer} from './currentVariantReducer'
import {default as currentColorReducer} from './currentColorReducer'
import {default as currentMixReducer} from './currentMixReducer'

import {default as listReducer} from './listReducer'

export default combineReducers({
    list: listReducer,
    currentProduct: currentProductReducer,
    currentVariant: currentVariantReducer,
    currentColor: currentColorReducer,
    currentMix: currentMixReducer,
});

