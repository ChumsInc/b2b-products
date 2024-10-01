import React from 'react';
import AlertList from "../alerts/AlertList";
import {NavItemElement, NavList} from "chums-components";
import {Outlet, useMatch, useNavigate} from "react-router";
import {useSearchParams} from "react-router-dom";
import {ErrorBoundary} from "react-error-boundary";
import ErrorFallbackComponent from "./ErrorFallbackComponent";


const tabList: NavItemElement[] = [
    {id: 'products', title: 'Products'},
    {id: 'colors', title: 'Colors'},
    {id: 'where-used', title: 'Where Used'}
];

const AppContent = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const match = useMatch({path: '/:page', end: false})

    const selectTabHandler = (tab: string) => {
        const url = `${tab}?${searchParams.toString()}`
        navigate(url);
    }

    return (
        <ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
            <NavList items={tabList} variant="tabs"
                     className="mb-3"
                     currentTab={match?.params?.page ?? ''} onChange={selectTabHandler}/>
            <AlertList/>
            <Outlet/>
        </ErrorBoundary>
    )
}

export default AppContent;
