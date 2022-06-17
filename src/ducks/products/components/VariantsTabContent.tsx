import React from "react";
import ProductVariantsEditor from "./ProductVariantsEditor";
import SortableVariantList from "./SortableVariantList";

const VariantsTabContent:React.FC = () => {

    return (
        <div>

            <ProductVariantsEditor />
            <SortableVariantList />
        </div>
    )
}

export default VariantsTabContent;
