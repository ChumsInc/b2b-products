import React, {useEffect} from 'react';
import ErrorFallbackComponent from "./ErrorFallbackComponent";
import ProductEditorTitle from "../products/product/ProductEditorTitle";
import ProductEditTabs from "../products/ProductEditTabs";
import {Outlet, useParams} from "react-router";
import {ErrorBoundary} from "react-error-boundary";
import {useSelector} from "react-redux";
import {selectCurrentKeyword} from "@/ducks/products/keyword/selectors";
import {useAppDispatch} from "./hooks";
import {loadProduct} from "@/ducks/products/product/actions";

export default function ProductEditor() {
    const dispatch = useAppDispatch();
    const keyword = useSelector(selectCurrentKeyword);
    const params = useParams<'keyword'>();

    useEffect(() => {
        if (!params.keyword) {
            return;
        }
        if (params.keyword !== keyword) {
            dispatch(loadProduct(params.keyword ?? 'new'))
        }
    }, [keyword, params]);

    return (
        <ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
            <ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
                <ProductEditorTitle/>
            </ErrorBoundary>
            <ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
                <ProductEditTabs/>
            </ErrorBoundary>
            <ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
                <Outlet/>
            </ErrorBoundary>
        </ErrorBoundary>
    )
}
