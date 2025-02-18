import React, {AnchorHTMLAttributes} from 'react';
import {Product} from "b2b-types";

export interface ProductPreviewLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
    product: Product;
}
export default function ProductPreviewLink({
    product,
    target,
    ...rest
                                           }:ProductPreviewLinkProps) {
    const keyword = product.redirectToParent
        ? product.parentProductKeyword
        : product.keyword;
    const params = new URLSearchParams();
    if (product.redirectToParent) {
        params.set('sku', product.itemCode)
    }
    const href = `https://b2b.chums.com/products/${keyword}?${params.toString()}`;
    return (
        <a href={href} target={target ?? '_blank'} rel="noopener noreferrer" {...rest}>
            Preview Page
            <span className="ms-1 bi-link-45deg" />
        </a>
    )
}
