import React from 'react';
import ProductMixEditor from "./ProductMixEditor";
import ProductMixComponents from "./ProductMixComponents";
import {useSelector} from "react-redux";
import {selectCurrentMix} from "./selectors";

const ProductMixTab = () => {
    const mix = useSelector(selectCurrentMix);
    return (
        <div>
            <ProductMixEditor/>
            {mix?.status && (
                <ProductMixComponents/>
            )}
        </div>
    )
}

export default ProductMixTab;
