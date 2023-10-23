import React from 'react';
import {ProductListItem} from "b2b-types";
import {Badge} from "chums-components";
import {SELL_AS_COLORS, SELL_AS_MIX, SELL_AS_SELF, SELL_AS_VARIANTS} from "../../../utils";

export const mixColor = '#4e9b5b';
export const colorsColor = '#ce0e2d';
export const selfColor = 'primary';
export const variantsColor = '#a9a8a8';


interface ProductSellAsIconProps {
    product: ProductListItem,
}

const ProductSellAsIcon = ({product}:ProductSellAsIconProps) => {
    return (
        <span className="sell-as-icons">
            {!product.availableForSale && <span className="bi-lightbulb text-dark me-1" />}
            {product.availableForSale && <span className="bi-lightbulb-fill text-warning me-1"  />}
            {product.sellAs === SELL_AS_VARIANTS &&
                <Badge color="custom" colorCode={variantsColor}>V:{product.variantsCount}</Badge>}
            {product.sellAs === SELL_AS_VARIANTS && !!product.selfCount &&
                <Badge color={selfColor}>S:{product.selfCount}</Badge>}
            {product.sellAs === SELL_AS_SELF && <Badge color={selfColor}>Self</Badge>}
            {product.sellAs === SELL_AS_VARIANTS && !!product.mixesCount &&
                <Badge color="custom" colorCode={mixColor}>M:{product.mixesCount}</Badge>}
            {product.sellAs === SELL_AS_MIX && <Badge color="custom" colorCode={mixColor}>Mix</Badge>}
            {product.sellAs === SELL_AS_VARIANTS && !!product.colorsCount &&
                <Badge color="custom" colorCode={colorsColor}>C:{product.colorsCount}</Badge>}
            {product.sellAs === SELL_AS_COLORS && <Badge color="custom" colorCode={colorsColor}>Colors</Badge>}
        </span>
    )
}

export default ProductSellAsIcon;
