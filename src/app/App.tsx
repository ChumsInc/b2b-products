import React, {useEffect, useState} from 'react';
import ProductScreen from "../ducks/products/ProductScreen";
import ColorScreen from "../ducks/colors/ColorScreen";
import {loadColors} from "../ducks/colors/actions";
import {Tab, TabList} from "chums-components";
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
    const [tab, setTab] = useState<Tab>(appTabs.products);

    useEffect(() => {
        dispatch(loadColors());
        dispatch(loadProductsList())
        dispatch(loadSeasons())
    }, []);

    const selectTabHandler = (tab: Tab) => {
        SessionStore.setItem(storeMainTab, tab.id);
        setTab(tab);
    }
    return (
        <div>
            <TabList tabs={tabList} currentTabId={tab.id} onSelectTab={selectTabHandler}/>
            <AlertList/>
            <div>
                {tab.id === appTabs.products.id && <ProductScreen/>}
                {tab.id === appTabs.colors.id && <ColorScreen/>}
            </div>
        </div>
    )
}

export default App;
