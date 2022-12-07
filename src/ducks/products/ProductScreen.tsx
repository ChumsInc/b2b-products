import React from "react";
import ProductTable from "./list/ProductTable";
import ProductEditTabs, {productEditTabsKey, productTabs} from "./product/ProductEditTabs";
import {useSelector} from "react-redux";
import {selectCurrentTab} from "chums-connected-components";
import MainEditForm from "./product/MainEditForm";
import ProductJSON from "./product/ProductJSON";
import ProductEditorTitle from "./product/ProductEditorTitle";
import VariantsTabContent from "./variant/VariantsTabContent";
import ProductColorsTab from "./color/ProductColorsTab";
import ProductMixTab from "./mix/ProductMixTab";
import ProductDetailsTab from "./product/ProductDetailsTab";
import ProductImagesTab from "./images/ProductImagesTab";

const ProductScreen: React.FC = () => {
    const tab = useSelector(selectCurrentTab(productEditTabsKey));


    return (
        <div className="row g-3">
            <div className="col-7">
                <h2>Product List</h2>
                <ProductTable/>
            </div>
            <div className="col-5">
                <ProductEditorTitle/>
                <ProductEditTabs/>
                {tab === productTabs.main.id && <MainEditForm />}
                {tab === productTabs.details.id && <ProductDetailsTab/>}
                {tab === productTabs.variant.id && <VariantsTabContent/>}
                {tab === productTabs.json.id && <ProductJSON/>}
                {tab === productTabs.colors.id && <ProductColorsTab/>}
                {tab === productTabs.mix.id && <ProductMixTab/>}
                {tab === productTabs.images.id && <ProductImagesTab/>}
            </div>
        </div>
    )
}

export default ProductScreen;
