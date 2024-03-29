import React, {useEffect} from "react";
import ProductTable from "./list/ProductTable";
import ProductEditTabs from "./tabs/ProductEditTabs";
import {useSelector} from "react-redux";
import MainEditForm from "./product/MainEditForm";
import ProductJSON from "./product/ProductJSON";
import ProductEditorTitle from "./product/ProductEditorTitle";
import VariantsTabContent from "./variant/VariantsTabContent";
import ProductColorsTab from "./color/ProductColorsTab";
import ProductMixTab from "./mix/ProductMixTab";
import ProductDetailsTab from "./product/ProductDetailsTab";
import ProductImagesTab from "./images/ProductImagesTab";
import {ErrorBoundary} from "react-error-boundary";
import {selectCurrentTab, selectTabList} from "./tabs";
import ErrorFallbackComponent from "../../app/ErrorFallbackComponent";
import {useParams} from "react-router";
import {useAppDispatch} from "../../app/hooks";
import {loadProduct, setNewProduct} from "./product/actions";
import {selectCurrentKeyword} from "./keyword";

const ProductScreen = () => {
    const dispatch = useAppDispatch();
    const productTabs = useSelector(selectTabList);
    const tab = useSelector(selectCurrentTab)
    const keyword = useSelector(selectCurrentKeyword);
    const params = useParams<{ keyword: string }>();

    useEffect(() => {
        if (!params.keyword) {
            dispatch(setNewProduct());
            return;
        }
        if (params.keyword !== keyword) {
            dispatch(loadProduct(params.keyword));
        }
    }, [params.keyword, keyword]);


    return (
        <div className="row g-3">
            <div className="col-7">
                <h2>Product List</h2>
                <ProductTable/>
            </div>
            <div className="col-5">
                <ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
                    <ProductEditorTitle/>
                    <ProductEditTabs/>
                    {tab === productTabs.main.id && <MainEditForm/>}
                    {tab === productTabs.details.id && <ProductDetailsTab/>}
                    {tab === productTabs.variant.id && <VariantsTabContent/>}
                    {tab === productTabs.json.id && <ProductJSON/>}
                    {tab === productTabs.colors.id && <ProductColorsTab/>}
                    {tab === productTabs.mix.id && <ProductMixTab/>}
                    {tab === productTabs.images.id && <ProductImagesTab/>}
                </ErrorBoundary>
            </div>
        </div>
    )
}

export default ProductScreen;
