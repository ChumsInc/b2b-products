import React, {useEffect, useReducer} from 'react';
import ProductScreen from "../ducks/products/ProductScreen";
import ColorScreen from "../ducks/colors/ColorScreen";
import {loadColors} from "../ducks/colors/actions";
import {initialTabState, Tab, TabList, tabsReducer} from "chums-components";
import {AppTabMap} from "./types";
import {SessionStore, storeMainTab} from "../localStore";
import {loadProductsList} from "../ducks/products/list/actions";
import {useAppDispatch} from "./hooks";
import {loadSeasons} from "../ducks/seasons";
import AlertList from "../ducks/alerts/AlertList";


export const appTabs: AppTabMap = {
    products: {id: 'products', title: 'Products'},
    colors: {id: 'colors', title: 'Colors'},
}
const tabList: Tab[] = [appTabs.products, appTabs.colors];

const App: React.FC = () => {
    const dispatch = useAppDispatch();
    const [tabs, tabsDispatch] = useReducer(tabsReducer, initialTabState);

    useEffect(() => {
        tabsDispatch({type: 'add', payload: tabList});
        tabsDispatch({type: 'select', payload: SessionStore.getItem(storeMainTab) ?? appTabs.products.id})
        dispatch(loadColors());
        dispatch(loadProductsList())
        dispatch(loadSeasons())
    }, []);

    const selectTabHandler = (tab: Tab) => {
        SessionStore.setItem(storeMainTab, tab.id);
        tabsDispatch({type: 'select', payload: tab.id})
    }
    return (
        <div>
            <TabList tabs={tabs.tabs} currentTabId={tabs.current || tabList[0].id} onSelectTab={selectTabHandler}/>
            <AlertList/>
            <div>
                {tabs.current === appTabs.products.id && <ProductScreen/>}
                {tabs.current === appTabs.colors.id && <ColorScreen/>}
            </div>
        </div>
    )
}

export default App;
