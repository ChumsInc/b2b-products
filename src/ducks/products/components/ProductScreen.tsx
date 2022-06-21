import React from "react";
import ProductTableFilterBar from "./ProductTableFilterBar";
import ProductTable from "./ProductTable";
import ProductEditTabs, {productEditTabsKey, productTabs} from "./ProductEditTabs";
import {useSelector} from "react-redux";
import {selectCurrentTab} from "chums-connected-components";
import MainEditForm from "./MainEditForm";
import ProductJSON from "./ProductJSON";
import ProductEditorTitle from "./ProductEditorTitle";
import VariantsTabContent from "./VariantsTabContent";
import ProductColorsTab from "./ProductColorsTab";
import ProductMixTab from "./ProductMixTab";
import ProductDetailsTab from "./ProductDetailsTab";

const ProductScreen: React.FC = () => {
    const tab = useSelector(selectCurrentTab(productEditTabsKey));


    return (
        <div className="row g-3">
            <div className="col-6">
                <h2>Product List</h2>
                <ProductTableFilterBar/>
                <ProductTable/>
            </div>
            <div className="col-6">
                <ProductEditorTitle/>
                <div className="row g-3">
                    <div className="col-5">
                        <MainEditForm/>
                    </div>
                    <div className="col-7">
                        <ProductEditTabs/>
                        {tab === productTabs.details.id && <ProductDetailsTab/>}
                        {tab === productTabs.variant.id && <VariantsTabContent/>}
                        {tab === productTabs.json.id && <ProductJSON/>}
                        {tab === productTabs.colors.id && <ProductColorsTab/>}
                        {tab === productTabs.mix.id && <ProductMixTab/>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductScreen;
