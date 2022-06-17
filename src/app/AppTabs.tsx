import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import {Tab, TabList, tabListCreatedAction} from "chums-ducks";
import {AppTabMap, TabMap} from "./types";

export const tabKey = 'app-tabs';
export const appTabs:AppTabMap = {
    products: {id: 'products', title: 'Products'},
    colors: {id: 'colors', title: 'Colors', active: true},
}
const tabList:Tab[] = [appTabs.products, appTabs.colors];

const AppTabs:React.FC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(tabListCreatedAction(tabList, tabKey, appTabs.products.id));
    }, []);

    return (
        <TabList tabKey={tabKey}/>
    )
}

export default AppTabs;

