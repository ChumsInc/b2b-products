import React from "react";
import type {ProductListItem} from "b2b-types";
import classNames from "classnames";
import numeral from "numeral";

export interface ProductPriceProps {
    product: ProductListItem,
}
const ProductPrice:React.FC<ProductPriceProps> = ({product}) => {
    if (!product.minPrice && !product.maxPrice && !product.salePrice) {
        return null;
    }
    const prices = [product.minPrice];
    if (product.maxPrice && product.maxPrice !== product.minPrice) {
        prices.push(product.maxPrice);
    }
    const className = classNames({
        'has-sale-price': !!product.salePrice,
    });
    return (
        <span className={className}>
            {prices.map(price => numeral(price).format('0,0.00')).join(' - ')}
            {!!product.salePrice && <span className="sale-price">{numeral(product.salePrice).format('0,0.00')}</span>}
        </span>
    )
}

export default ProductPrice;
