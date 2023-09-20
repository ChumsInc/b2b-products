import {Tab} from "chums-components";
import {createAction, createReducer} from "@reduxjs/toolkit";
import {loadProduct, saveProduct, setNewProduct} from "../product/actions";
import {Product} from "b2b-types/src/products";
import {isSellAsColors, isSellAsMix, isSellAsVariants} from "../../../utils";
import {defaultProduct} from "../../../defaults";
import {RootState} from "../../../app/configureStore";

export type ProductTabId = 'main' | 'details' | 'variant' | 'json' | 'colors' | 'mix' | 'images';
export interface ProductTab extends Tab {
    id: ProductTabId;
}

export type ProductTabMap = {
    [key in ProductTabId]: ProductTab;
};


export interface ProductTabsState {
    list: ProductTabMap,
    currentTab: ProductTabId;
}

const defaultTabState = (tabs: ProductTabMap, product: Product | null): ProductTabMap => {
    tabs.variant.disabled = !isSellAsVariants(product);
    tabs.variant.title = isSellAsVariants(product) ? `Variants (${product.variants.length})` : 'Variants';
    tabs.colors.disabled = !isSellAsColors(product);
    tabs.colors.title = isSellAsColors(product) ? `Colors (${product.items.length})` : 'Colors';
    tabs.mix.disabled = !isSellAsMix(product);
    tabs.images.title = `Images (${product?.images?.length ?? 0})`;
    tabs.images.disabled = !product?.id;
    return tabs;
}

const initialState:ProductTabsState = {
    list: {
        main: {id: 'main', title: 'Main'},
        details: {id: 'details', title: 'Details'},
        variant: {id: 'variant', title: 'Variants', disabled: true},
        colors: {id: 'colors', title: 'Colors', disabled: true},
        mix: {id: 'mix', title: 'Mix', disabled: true},
        images: {id: 'images', title: 'Images (0)', disabled: true},
        json: {id: 'json', title: 'Data'},
    },
    currentTab: 'main',
}

export const setCurrentTab = createAction<ProductTabId>('products/colors/setTab');

export const selectTabList = (state:RootState) => state.products.tabs.list;
export const selectCurrentTab = (state:RootState) => state.products.tabs.currentTab;

const tabsReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(setNewProduct, (state) => {
            state.list = defaultTabState(state.list, defaultProduct);
            state.currentTab = 'main';
        })
        .addCase(loadProduct.fulfilled, (state, action) => {
            state.list = defaultTabState(state.list, action.payload);
            if (state.list[state.currentTab].disabled) {
                state.currentTab = 'main'
            }
        })
        .addCase(saveProduct.fulfilled, (state, action) => {
            state.list = defaultTabState(state.list, action.payload);
            if (state.list[state.currentTab].disabled) {
                state.currentTab = 'main'
            }
        })
        .addCase(setCurrentTab, (state, action) => {
            if (!state.list[action.payload].disabled) {
                state.currentTab = action.payload;
            }
        })

});

export default tabsReducer;
