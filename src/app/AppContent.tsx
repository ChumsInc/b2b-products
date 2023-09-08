import React from 'react';
import AlertList from "../ducks/alerts/AlertList";
import {NavItemElement, NavList} from "chums-components";
import {AppTabMap} from "./types";
import {Outlet, useMatch, useNavigate} from "react-router";
import {useSearchParams} from "react-router-dom";

export const appTabs: AppTabMap = {
    products: {id: 'products', title: 'Products'},
    colors: {id: 'colors', title: 'Colors'},
}
const tabList: NavItemElement[] = [
    {id: 'products', title: 'Products'},
    {id: 'colors', title: 'Colors'},
];

const AppContent = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const match = useMatch({path: '/:page', end: false})

    const selectTabHandler = (tab: string) => {
        const url = `${tab}?${searchParams.toString()}`
        navigate(url);
    }

    return (
        <div>
            <NavList items={tabList} currentTab={match?.params?.page ?? ''} onChange={selectTabHandler} variant="tabs"/>
            <AlertList/>
            <Outlet/>
        </div>
    )
}

export default AppContent;
