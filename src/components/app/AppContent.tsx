import {Outlet} from "react-router";
import {ErrorBoundary} from "react-error-boundary";
import ErrorFallbackComponent from "./ErrorFallbackComponent";
import AppTabs from "./AppTabs";
import styled from "@emotion/styled";

const AppContainer = styled.div`
    --sell-as-self-color: var(--bs-primary);
    --bs-font-monospace: "Roboto Mono", SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    --sell-as-variants-color: var(--bs-secondary);
    --sell-as-mix-color: var(--bs-success);
    --sell-as-colors-color: #ce0e2d;
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
    .btn.btn-sell-as-self,
    .btn-outline-sell-as-self:hover,
    .badge.sell-as-self {
        background-color: var(--sell-as-self-color);
        border-color: var(--sell-as-self-color);
        color: white;
    }
    .btn-outline-sell-as-self {
        background-color: transparent;
        color: var(--sell-as-self-color);
        border-color: var(--sell-as-self-color);
    }

    .btn.btn-sell-as-variants,
    .btn-outline-sell-as-variants:hover,
    .badge.sell-as-variants {
        background-color: var(--sell-as-variants-color);
        border-color: var(--sell-as-variants-color);
        color: white;
    }
    .btn-outline-sell-as-variants {
        background-color: transparent;
        color: var(--sell-as-variants-color);
        border-color: var(--sell-as-variants-color);
    }

    .btn.btn-sell-as-mix,
    .btn-outline-sell-as-mix:hover,
    .badge.sell-as-mix {
        background-color: var(--sell-as-mix-color);
        border-color: var(--sell-as-mix-color);
        color: white;
    }
    .btn-outline-sell-as-mix {
        background-color: transparent;
        color: var(--sell-as-mix-color);
        border-color: var(--sell-as-mix-color);
    }

    .btn.btn-sell-as-colors,
    .btn-outline-sell-as-colors:hover,
    .badge.sell-as-colors {
        background-color: var(--sell-as-colors-color);
        border-color: var(--sell-as-colors-color);
        color: white;
    }
    .btn-outline-sell-as-colors {
        background-color: transparent;
        color: var(--sell-as-colors-color);
        border-color: var(--sell-as-colors-color);
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
