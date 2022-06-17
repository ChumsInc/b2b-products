import {combineReducers} from "redux";
import {
    deleteCurrentVariantResolved,
    loadProductPending,
    loadProductRejected,
    loadProductResolved,
    ProductsAction,
    saveCurrentVariant,
    saveCurrentVariantPending,
    saveCurrentVariantRejected,
    saveCurrentVariantResolved,
    saveProductPending,
    saveProductRejected,
    saveProductResolved,
    setCurrentProduct,
    setCurrentVariant,
    updateVariant
} from "./actionTypes";
import {defaultVariantSorterProps} from "./constants";
import {EditableVariant} from "../../types/product";
import {ProductVariant} from "b2b-types/src/products";
import {variantListSorter} from "./sorter";
import {defaultVariant} from "../../defaults";

const variantReducer = (state: ProductVariant = defaultVariant, action: ProductsAction): EditableVariant => {
    const {type, payload} = action;
    switch (type) {
    case loadProductResolved:
    case saveProductResolved:
    case setCurrentProduct:
        if (payload?.product && payload.product.variants && !!payload.product.variants.length) {
            const [variant] = [...payload.product.variants].sort(variantListSorter(defaultVariantSorterProps))
            return {...variant}
        }
        if (payload?.variant) {
            return {...payload.variant};
        }
        return {...defaultVariant};
    case setCurrentVariant:
    case saveCurrentVariantResolved:
        if (payload?.variant) {
            return {...payload.variant};
        }
        return {...defaultVariant};
    case updateVariant:
        if (payload?.variantProps) {
            return {...state, ...payload.variantProps, changed: true};
        }
        return state;
    case deleteCurrentVariantResolved:
        return {...defaultVariant};
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
    case saveCurrentVariantPending:
        return true;
    case saveCurrentVariantResolved:
    case saveCurrentVariantRejected:
        return false;
    default:
        return state;
    }
}


export default combineReducers({
    variant: variantReducer,
    loading: loadingReducer,
    saving: savingReducer
})
