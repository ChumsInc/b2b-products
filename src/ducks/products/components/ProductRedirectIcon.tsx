import React, {MouseEvent} from 'react';
import classNames from "classnames";
import {useDispatch} from "react-redux";
import {loadProductAction} from "../actions";
import {ProductListItem} from "b2b-types";

export interface ProductRedirectIconProps {
    product: ProductListItem,
}

const ProductRedirectIcon: React.FC<ProductRedirectIconProps> = ({product}) => {
    const dispatch = useDispatch();
    if (!product.redirectToParent) {
        return null;
    }
    const clickHandler = (ev: MouseEvent<HTMLSpanElement>) => {
        if (!product.parentProductKeyword) {
            return;
        }
        ev.preventDefault();
        ev.stopPropagation();
        dispatch(loadProductAction(product.parentProductKeyword))
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
