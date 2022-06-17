import {combineReducers} from "redux";
import {
    loadProductPending,
    loadProductRejected,
    loadProductResolved,
    ProductsAction,
    saveMixComponentPending, saveMixComponentRejected,
    saveMixComponentResolved,
    saveMixPending, saveMixRejected,
    saveMixResolved,
    saveProductResolved,
    setCurrentProduct, updateCurrentMix, updateCurrentMixComponent
} from "./actionTypes";
import {EditableProductMixComponent, EditableProductMixItem} from "../../types/product";
import {defaultMixComponent, defaultMixItem} from "../../defaults";
import {mixComponentSorter} from "./sorter";

const mixReducer = (state: EditableProductMixItem = defaultMixItem, action: ProductsAction): EditableProductMixItem => {
    const {type, payload} = action;
    switch (type) {
    case setCurrentProduct:
        if (payload?.product) {
            return {
                ...defaultMixItem,
                productId: payload.product.id,
                mixName: payload.product.name,
                itemCode: payload.product.itemCode,
                ...payload.product.mix,
            };
        }
        return {...defaultMixItem};
    case loadProductResolved:
    case saveProductResolved:
        if (payload?.product && !!payload.product?.mix) {
            return {...payload.product.mix};
        }
        return {...defaultMixItem};
    case saveMixResolved:
    case saveMixComponentResolved:
        if (payload?.mix) {
            return {...payload.mix};
        }
        return state;
    case updateCurrentMix:
        if (payload?.mixProps) {
            return {...state, ...payload.mixProps, changed: true};
        }
        return state;
    default:
        return state;
    }
}

const componentsReducer = (state:EditableProductMixComponent[] = [], action:ProductsAction):EditableProductMixComponent[] => {
    const {type, payload} = action;
    switch (type) {
    case setCurrentProduct:
    case loadProductResolved:
    case saveProductResolved:
        if (payload?.product && payload.product.mix) {
            return [...payload.product.mix.items].sort(mixComponentSorter);
        }
        return [];
    case saveMixResolved:
    case saveMixComponentResolved:
        if (payload?.mix) {
            return [...payload.mix.items].sort(mixComponentSorter);
        }
        return state;
    case updateCurrentMixComponent:
        if (payload?.mixComponentProps) {
            return [
                ...state.filter(c => c.id !== payload.mixComponentProps?.id),
                {...defaultMixComponent, ...payload.mixComponentProps, changed: true},
            ].sort(mixComponentSorter)
        }
        return state;
    default:
        return state;
    }
}

const loadingReducer = (state: boolean = false, action: ProductsAction): boolean => {
    switch (action.type) {
    case loadProductPending:
        return true;
    case loadProductResolved:
    case loadProductRejected:
        return false;
    default:
        return state;
    }
}

const savingReducer = (state: boolean = false, action: ProductsAction): boolean => {
    switch (action.type) {
    case saveMixPending:
    case saveMixComponentPending:
        return true;
    case saveMixResolved:
    case saveMixRejected:
    case saveMixComponentResolved:
    case saveMixComponentRejected:
        return false;
    default:
        return state;
    }
}


export default combineReducers({
    mix: mixReducer,
    components: componentsReducer,
    loading: loadingReducer,
    saving: savingReducer
})
