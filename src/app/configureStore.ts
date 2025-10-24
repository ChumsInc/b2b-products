import {configureStore} from '@reduxjs/toolkit'
import {combineReducers} from "redux";
import {api} from "@/src/api/base-api";
import alertsSlice from "../ducks/alerts";
import {default as colorsReducer} from '../ducks/colors';
import {default as itemSearchReducer} from '../ducks/item-search';
import {default as keywordsReducer} from '../ducks/keywords';
import productListSlice from "@/ducks/productList/productListSlice.ts";
import seasonsSlice from '../ducks/seasons';
import whereUsedReducer from "../ducks/where-used";
import {type TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import productSlice from "@/ducks/products/productSlice.ts";
import productKeywordSlice from "@/ducks/products/productKeywordSlice.ts";
import {productMixSlice} from "@/ducks/products/productMixSlice.ts";
import {productMixBOMSlice} from "@/ducks/products/productMixBOMSlice.ts";
import {productColorItemsSlice} from "@/ducks/products/productColorItemsSlice.ts";
import {productImagesSlice} from "@/ducks/products/productImagesSlice.ts";
import {productVariantsSlice} from "@/ducks/products/productVariantsSlice.ts";

const rootReducer = combineReducers({
    [api.reducerPath]: api.reducer,
    [alertsSlice.reducerPath]: alertsSlice.reducer,
    colors: colorsReducer,
    itemSearch: itemSearchReducer,
    keywords: keywordsReducer,
    [productListSlice.reducerPath]: productListSlice.reducer,
    [productSlice.reducerPath]: productSlice.reducer,
    [productColorItemsSlice.reducerPath]: productColorItemsSlice.reducer,
    [productKeywordSlice.reducerPath]: productKeywordSlice.reducer,
    [productMixSlice.reducerPath]: productMixSlice.reducer,
    [productMixBOMSlice.reducerPath]: productMixBOMSlice.reducer,
    [productImagesSlice.reducerPath]: productImagesSlice.reducer,
    [productVariantsSlice.reducerPath]: productVariantsSlice.reducer,
    [seasonsSlice.reducerPath]: seasonsSlice.reducer,
    whereUsed: whereUsedReducer,
});

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        // serializableCheck: {
        //     ignoredActionPaths: ['payload.error', 'meta.arg', 'meta.baseQueryMeta'],
        // }
    }).concat(api.middleware)
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


export default store;
