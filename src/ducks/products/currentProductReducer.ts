import {combineReducers} from "redux";
import {Product} from "b2b-types";
import {
    deleteCurrentVariantResolved,
    duplicateProduct,
    loadProductPending,
    loadProductRejected,
    loadProductResolved,
    ProductsAction,
    saveCurrentVariantResolved,
    saveProductPending,
    saveProductRejected,
    saveProductResolved,
    setCurrentProduct, setDefaultCurrentVariantResolved,
    updateProduct,
    updateProductAdditionalData
} from "./actionTypes";
import {defaultVariantSorterProps} from "./constants";
import {EditableProduct} from "../../types/product";
import {variantListSorter} from "./sorter";
import {defaultProduct} from "../../defaults";

const productReducer = (state: Product = defaultProduct, action: ProductsAction): EditableProduct => {
    const {type, payload} = action;
    switch (type) {
    case loadProductResolved:
    case saveProductResolved:
    case setCurrentProduct:
        if (payload?.product) {
            return {...payload.product};
        }
        return {...defaultProduct};
    case duplicateProduct:
        return {...state, changed: true, keyword: '', id: 0};
    case updateProduct:
        if (payload?.props) {
            return {...state, ...payload.props, changed: true};
        }
        return state;
    case updateProductAdditionalData:
        if (payload?.props) {
            return {
                ...state,
                additionalData: {
                    ...state.additionalData,
                    ...payload.props,
                },
                changed: true,
            }
        }
        return state;
    case saveCurrentVariantResolved:
        if (payload?.variant) {
            return {
                ...state,
                variants: [
                    ...(state.variants || []).filter(v => v.id !== payload.variant?.id),
                    payload.variant,
                ].sort(variantListSorter(defaultVariantSorterProps))
            }
        }
        return state;
    case deleteCurrentVariantResolved:
    case setDefaultCurrentVariantResolved:
        if (payload?.variants) {
            return {
                ...state,
                variants: [...payload.variants].sort(variantListSorter(defaultVariantSorterProps))
            }
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
    case saveProductPending:
        return true;
    case saveProductResolved:
    case saveProductRejected:
        return false;
    default:
        return state;
    }
}


export default combineReducers({
    product: productReducer,
    loading: loadingReducer,
    saving: savingReducer
})
