import React from "react";
import ProductVariantsEditor from "./ProductVariantsEditor";
import SortableVariantList from "./SortableVariantList";

const VariantsTabContent = () => {

    return (
        <div>

            <ProductVariantsEditor />
            <SortableVariantList />
        </div>
    )
}

export default VariantsTabContent;
