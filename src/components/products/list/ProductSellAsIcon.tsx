import React, {HTMLAttributes} from 'react';
import {Product, ProductListItem} from "b2b-types";
import {isProductListItem, SELL_AS_COLORS, SELL_AS_MIX, SELL_AS_SELF, SELL_AS_VARIANTS} from "../../../utils";
import {Badge} from "react-bootstrap";
import styled from "@emotion/styled";

const SellAsBadgeList = styled.div`
    display: flex;
    justify-content: flex-start;
    gap: 0.125rem;
`

interface ProductSellAsIconProps extends HTMLAttributes<HTMLDivElement> {
    showStatusIcon?: boolean;
    product: ProductListItem | Product;
}

const ProductSellAsIcon = ({showStatusIcon, product, ...rest}: ProductSellAsIconProps) => {
    if (!product) {
        return null;
    }
    return (
        <SellAsBadgeList {...rest}>
            {showStatusIcon && (
                <Badge bg="light">
                    {product.availableForSale && (<span className="bi-lightbulb-fill text-warning"/>)}
                    {!product.availableForSale && (<span className="bi-lightbulb-fill text-dark"/>)}
                </Badge>
            )}
            {isProductListItem(product) && product.sellAs === SELL_AS_VARIANTS && (
                <>
                    {product.variantsCount > 0 && (
                        <Badge pill bg="secondary">V: {JSON.stringify(product.variantsCount)}</Badge>
                    )}
                    {product.selfCount > 0 && (
                        <Badge pill bg="secondary">S: {JSON.stringify(product.selfCount)}</Badge>
                    )}
                    {product.mixesCount > 0 && (
                        <Badge pill bg="success">M: {JSON.stringify(product.mixesCount)}</Badge>
                    )}
                    {product.colorsCount > 0 && (
                        <Badge pill bg="danger">C: {JSON.stringify(product.colorsCount)}</Badge>
                    )}
                </>
            )}
            {product.sellAs === SELL_AS_SELF && (
                <Badge pill bg="primary">Self</Badge>
            )}
            {product.sellAs === SELL_AS_MIX && (
                <Badge pill bg="success">Mix</Badge>
            )}
            {product.sellAs === SELL_AS_COLORS && (
                <Badge pill bg="danger">Colors</Badge>
            )}
        </SellAsBadgeList>
    )
}

export default ProductSellAsIcon;
