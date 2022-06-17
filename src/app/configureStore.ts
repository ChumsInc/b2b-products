import {configureStore} from '@reduxjs/toolkit'
import {combineReducers} from "redux";
import {alertsReducer, pagesReducer, sortableTablesReducer, tabsReducer} from "chums-ducks";
import {default as colorsReducer} from '../ducks/colors';
import {default as itemSearchReducer} from '../ducks/item-search';
import {default as keywordsReducer} from '../ducks/keywords';
import {default as productsReducer} from '../ducks/products';
import {default as seasonsReducer} from '../ducks/seasons';

const rootReducer = combineReducers({
    alerts: alertsReducer,
    colors: colorsReducer,
    itemSearch: itemSearchReducer,
    keywords: keywordsReducer,
    pages: pagesReducer,
    products: productsReducer,
    seasons: seasonsReducer,
    sortableTables: sortableTablesReducer,
    tabs: tabsReducer,
});

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActionPaths: ['payload.error'],
        }
    })
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export default store;
