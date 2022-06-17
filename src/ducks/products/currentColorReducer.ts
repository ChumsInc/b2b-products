import {combineReducers} from "redux";
import {
    deleteCurrentColorItemResolved,
    loadProductPending,
    loadProductRejected,
    loadProductResolved,
    ProductsAction,
    saveCurrentColorItemPending,
    saveCurrentColorItemRejected,
    saveCurrentColorItemResolved,
    saveCurrentVariantResolved,
    saveProductResolved,
    setCurrentColorItem,
    setCurrentProduct,
    setCurrentVariant,
    updateCurrentColorItem
} from "./actionTypes";
import {EditableProductColorItem} from "../../types/product";
import {ProductColorItem, ProductColorVariant} from "b2b-types/src/products";
import {colorItemSorter} from "./sorter";
import {defaultColorItem} from "../../defaults";

const listReducer = (state: ProductColorItem[] = [], action: ProductsAction): ProductColorItem[] => {
    const {type, payload} = action;
    switch (type) {
    case setCurrentProduct:
        return [];
    case loadProductResolved:
    case saveProductResolved:
        if (payload?.product && !!payload.product.items) {
            return [...payload.product.items].sort(colorItemSorter);
        }
        return state;
    case saveCurrentColorItemResolved:
        if (payload?.colorItems) {
            return payload.colorItems.sort(colorItemSorter);
        }
        return state;
    default:
        return state;
    }
}

const colorItemReducer = (state: ProductColorItem = defaultColorItem, action: ProductsAction): EditableProductColorItem => {
    const {type, payload} = action;
    switch (type) {
    case loadProductResolved:
    case saveProductResolved:
    case setCurrentProduct:
    case setCurrentVariant:
    case saveCurrentVariantResolved:
    case deleteCurrentColorItemResolved:
        return {...defaultColorItem};
    case setCurrentColorItem:
        if (payload?.colorItem) {
            return {...payload.colorItem}
        }
        return state;
    case updateCurrentColorItem:
        if (payload?.colorItemProps) {
            return {...state, ...payload.colorItemProps, changed: true}
        }
        return state;
    case saveCurrentColorItemResolved:
        if (payload?.colorItems) {
            const [item] = payload.colorItems.filter(i => i.id === state.id || i.color.id === state.color.id);
            if (item) {
                return {...item}
            }
        }
        return {...defaultColorItem};
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
    case saveCurrentColorItemPending:
        return true;
    case saveCurrentColorItemResolved:
    case saveCurrentColorItemRejected:
        return false;
    default:
        return state;
    }
}


export default combineReducers({
    list: listReducer,
    colorItem: colorItemReducer,
    loading: loadingReducer,
    saving: savingReducer
})
