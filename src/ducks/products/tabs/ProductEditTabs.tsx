import React from 'react';
import {useSelector} from "react-redux";
import {Tab, TabList} from "chums-components";
import {useAppDispatch} from "../../../app/hooks";
import {ProductTabId, selectCurrentTab, selectTabList, setCurrentTab} from "./index";

const ProductEditTabs = () => {
    const dispatch = useAppDispatch();
    const tabList = useSelector(selectTabList)
    const currentTab = useSelector(selectCurrentTab);

    const selectTabHandler = (tab: Tab) => {
        dispatch(setCurrentTab(tab.id as ProductTabId))
    }

    return (
        <TabList tabs={Object.values(tabList)} currentTabId={currentTab} onSelectTab={selectTabHandler}/>
    )
}

export default ProductEditTabs;
