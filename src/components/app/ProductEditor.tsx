import {useEffect} from 'react';
import ErrorFallbackComponent from "./ErrorFallbackComponent";
import ProductEditorTitle from "../products/product/ProductEditorTitle";
import ProductEditTabs from "../products/ProductEditTabs";
import {Outlet, useParams} from "react-router";
import {ErrorBoundary} from "react-error-boundary";
import {selectCurrentKeyword} from "@/ducks/products/productKeywordSlice.ts";
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {loadProduct} from "@/ducks/products/actions/product-actions.ts";

export default function ProductEditor() {
    const dispatch = useAppDispatch();
    const keyword = useAppSelector(selectCurrentKeyword);
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
