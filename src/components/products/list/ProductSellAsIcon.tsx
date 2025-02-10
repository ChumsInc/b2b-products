import React from 'react';
import {ProductListItem} from "b2b-types";
import {SELL_AS_COLORS, SELL_AS_MIX, SELL_AS_SELF, SELL_AS_VARIANTS} from "../../../utils";
import MiniChip from "../../MiniChip";

export const mixColor = '#4e9b5b';
export const colorsColor = '#ce0e2d';
export const selfColor = '#00F';
export const variantsColor = '#a9a8a8';


interface ProductSellAsIconProps {
    product: ProductListItem,
}

const ProductSellAsIcon = ({product}: ProductSellAsIconProps) => {
    return (
        <span className="sell-as-icons">
            {!product.availableForSale && <span className="bi-lightbulb text-dark me-1"/>}
            {product.availableForSale && <span className="bi-lightbulb-fill text-warning me-1"/>}
            {product.sellAs === SELL_AS_VARIANTS && (
                <MiniChip bgColor={variantsColor} label={`V:${product.variantsCount}`}/>
            )}
            {product.sellAs === SELL_AS_VARIANTS && !!product.selfCount && (
                <MiniChip bgColor={selfColor} label={`S:${product.selfCount}`}/>
            )}
            {product.sellAs === SELL_AS_SELF && (
                <MiniChip bgColor={selfColor} label="Self"/>
            )}
            {product.sellAs === SELL_AS_VARIANTS && !!product.mixesCount && (
                <MiniChip bgColor={mixColor} label={`M:${product.mixesCount}`}/>
            )}
            {product.sellAs === SELL_AS_MIX && (
                <MiniChip bgColor={mixColor} label="Mix" />
            )}
            {product.sellAs === SELL_AS_VARIANTS && !!product.colorsCount && (
                <MiniChip bgColor={colorsColor} label={`C:${product.colorsCount}`}/>
            )}
            {product.sellAs === SELL_AS_COLORS && (
                <MiniChip bgColor={colorsColor} label="Colors"/>
            )}
        </span>
    )
}

export default ProductSellAsIcon;
