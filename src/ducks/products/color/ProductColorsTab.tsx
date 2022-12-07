import React from 'react';
import ProductColorEditor from "./ProductColorEditor";
import ProductColorList from "./ProductColorList";

const ProductColorsTab:React.FC = () => {

    return (
        <div>
            <ProductColorEditor />
            <ProductColorList />
        </div>
    )
}

export default ProductColorsTab;
