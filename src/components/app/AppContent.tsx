import React from 'react';
import {Outlet} from "react-router";
import {ErrorBoundary} from "react-error-boundary";
import ErrorFallbackComponent from "./ErrorFallbackComponent";
import AppTabs from "./AppTabs";


const AppContent = () => {
    return (
        <ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
            <AppTabs className="mb-3"/>
            <Outlet/>
        </ErrorBoundary>
    )
}

export default AppContent;
