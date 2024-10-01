import React from 'react';
import {useSelector} from "react-redux";
import {selectCurrentColorItem} from "../../../ducks/products/color/selectors";
import classNames from "classnames";
import ProductImage from "../../app/ProductImage";
import {selectCurrentProduct} from "../../../ducks/products/product/selectors";

const ProductColorImage = () => {
    const current = useSelector(selectCurrentColorItem);
    const product = useSelector(selectCurrentProduct);
    if (!current) {
        return null;
    }
    return (
        <ProductImage filename={current.additionalData?.image_filename || product?.image || 'missing.png'}
                      className={classNames({'text-danger': !current.status})}
                      colorCode={current.colorCode} itemCode={current.itemCode} size={250}/>
    )
}
export default ProductColorImage;
