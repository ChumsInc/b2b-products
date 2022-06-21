import React from "react";
import {ConnectedTabs} from "chums-connected-components";
import {Tab} from "chums-components";
import {AppTabMap} from "./types";

export const tabKey = 'app-tabs';
export const appTabs: AppTabMap = {
    products: {id: 'products', title: 'Products'},
    colors: {id: 'colors', title: 'Colors'},
}
const tabList: Tab[] = [appTabs.products, appTabs.colors];

const AppTabs: React.FC = () => {
    return (
        <ConnectedTabs tabKey={tabKey} tabs={tabList} defaultTabId={appTabs.products.id}/>
    )
}

export default AppTabs;

