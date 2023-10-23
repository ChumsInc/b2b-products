import React from "react";
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

const ProductScreen = () => {
    const productTabs = useSelector(selectTabList);
    const tab = useSelector(selectCurrentTab)

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
