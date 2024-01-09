import React, {MouseEvent} from 'react';
import classNames from "classnames";
import {ProductListItem} from "b2b-types";
import {loadProduct} from "./actions";
import {useAppDispatch} from "../../../app/hooks";
import {useNavigate} from "react-router";

export interface ProductRedirectIconProps {
    product: ProductListItem,
}

const ProductRedirectIcon: React.FC<ProductRedirectIconProps> = ({product}) => {
    const navigate = useNavigate();
    if (!product.redirectToParent) {
        return null;
    }
    const clickHandler = (ev: MouseEvent<HTMLSpanElement>) => {
        if (!product.parentProductKeyword) {
            return;
        }
        ev.preventDefault();
        ev.stopPropagation();
        const url = `/products/${encodeURIComponent(product.parentProductKeyword)}`
        navigate(url);
    }

    const className = classNames('redirect-icon', {
        'bi-box-arrow-up-right': product.redirectToParent,
        'ps-1': product.redirectToParent,
    })
    return (
        <span className={className} onClick={clickHandler}>{product.parentProductKeyword || ''}</span>
    )
}

export default ProductRedirectIcon;
