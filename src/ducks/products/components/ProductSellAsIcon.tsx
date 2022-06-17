import React from 'react';
import {ProductListItem} from "b2b-types/src/products";
import {
    colorsColor,
    mixColor,
    selfColor,
    SELL_AS_COLORS,
    SELL_AS_MIX,
    SELL_AS_SELF,
    SELL_AS_VARIANTS,
    variantsColor
} from "../constants";
import {Badge} from "chums-ducks";



interface ProductSellAsIconProps {
    product: ProductListItem,
}

const ProductSellAsIcon:React.FC<ProductSellAsIconProps> = ({product}) => {
    return (
        <span className="sell-as-icons">
            {product.sellAs === SELL_AS_VARIANTS && <Badge color="custom" colorCode={variantsColor}>V:{product.variantsCount}</Badge>}
            {product.sellAs === SELL_AS_VARIANTS && !!product.selfCount && <Badge color={selfColor}>S:{product.selfCount}</Badge>}
            {product.sellAs === SELL_AS_SELF && <Badge color={selfColor}>Self</Badge>}
            {product.sellAs === SELL_AS_VARIANTS && !!product.mixesCount && <Badge color="custom" colorCode={mixColor}>M:{product.mixesCount}</Badge>}
            {product.sellAs === SELL_AS_MIX && <Badge color="custom" colorCode={mixColor}>Mix</Badge>}
            {product.sellAs === SELL_AS_VARIANTS && !!product.colorsCount && <Badge color="custom" colorCode={colorsColor}>C:{product.colorsCount}</Badge>}
            {product.sellAs === SELL_AS_COLORS && <Badge color="custom" colorCode={colorsColor}>Colors</Badge>}
        </span>
    )
}

export default ProductSellAsIcon;
