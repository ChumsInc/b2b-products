import React from 'react';
import ProductColorEditor from "./ProductColorEditor";
import ProductColorList from "./ProductColorList";
import ProductColorImage from "./ProductColorImage";

const ProductColorsTab:React.FC = () => {

    return (
        <div>
            <div className="row g-3">
                <div className="col-lg-12 col-xl-6">
                    <ProductColorEditor />
                </div>
                <div className="d-lg-none d-xl-block col-xl-6">
                    <ProductColorImage />
                </div>
            </div>
            <ProductColorList />
        </div>
    )
}

export default ProductColorsTab;
