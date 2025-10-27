import {Outlet} from "react-router";
import {ErrorBoundary} from "react-error-boundary";
import ErrorFallbackComponent from "./ErrorFallbackComponent";
import AppTabs from "./AppTabs";
import styled from "@emotion/styled";

const AppContainer = styled.div`
    h2 {
        font-size: 1.5rem;
    }
    figure.product-image {
        &.image-80 {
            max-width: calc(2rem + 80px);
        }
        &.image-250 {
            max-width: calc(2rem + 250px);
        }
        &.image-400 {
            max-width: calc(2rem + 400px);
        }
        figcaption {
            white-space: nowrap;
            .filename {
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }
    }
    .color-swatch {
        width: 2rem;
        background-size: cover;
        background-position: center;
        text-decoration: none;
    }
`

const AppContent = () => {
    return (
        <ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
            <AppTabs className="mb-3"/>
            <AppContainer>
                <Outlet/>
            </AppContainer>
        </ErrorBoundary>
    )
}

export default AppContent;
