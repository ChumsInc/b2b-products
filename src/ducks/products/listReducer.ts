import {combineReducers} from "redux";
import {ProductList} from "b2b-types";
import {
    filterActiveProducts,
    filterAvailableProducts,
    filterSaleProducts,
    loadProductResolved,
    loadProductsPending,
    loadProductsRejected,
    loadProductsResolved,
    ProductFilter,
    ProductsAction,
    saveProductResolved,
    searchProducts
} from "./actionTypes";
import {defaultFilter} from "./constants";
import {productListItem} from "./utils";


const listReducer = (state: ProductList = {}, action: ProductsAction): ProductList => {
    const {type, payload} = action;
    switch (type) {
    case loadProductsResolved:
        if (payload?.list) {
            const list: ProductList = {}
            payload.list.forEach(p => {
                list[p.keyword] = p;
            })
            return list;
        }
        return {};
    case saveProductResolved:
    case loadProductResolved:
        if (payload?.product) {
            return {
                ...state,
                [payload.product.keyword]: productListItem(payload.product),
            }
        }
        return state;
    default:
        return state;
    }
}


const loadingReducer = (state: boolean = false, action: ProductsAction): boolean => {
    switch (action.type) {
    case loadProductsPending:
        return true;
    case loadProductsResolved:
    case loadProductsRejected:
        return false;
    default:
        return state;
    }
}

const searchReducer = (state: string = '', action: ProductsAction): string => {
    const {type, payload} = action;
    switch (type) {
    case searchProducts:
        return payload?.value || '';
    default:
        return state;
    }
}

const filterReducer = (state: ProductFilter = {...defaultFilter}, action: ProductsAction): ProductFilter => {
    const {type, payload} = action;
    switch (type) {
    case filterActiveProducts:
        return {
            ...state,
            isActive: !!payload?.checked,
        };
    case filterSaleProducts:
        return {
            ...state,
            hasSalePrice: !!payload?.checked,
        }
    case filterAvailableProducts:
        return {
            ...state,
            isAvailableForSale: !!payload?.checked,
        }
    default:
        return state;
    }
}

export default combineReducers({
    list: listReducer,
    loading: loadingReducer,
    search: searchReducer,
    filter: filterReducer,
});

