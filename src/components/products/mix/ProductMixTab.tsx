import React from 'react';
import ProductMixEditor from "./ProductMixEditor";
import ProductMixComponents from "./ProductMixComponents";
import {useSelector} from "react-redux";
import {selectCurrentMix} from "../../../ducks/products/mix/selectors";

const ProductMixTab: React.FC = () => {
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
