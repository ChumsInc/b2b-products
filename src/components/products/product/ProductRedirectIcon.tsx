import type {ProductListItem} from "b2b-types";
import {Link} from "react-router";

export interface ProductRedirectIconProps {
    product: ProductListItem,
}

const ProductRedirectIcon = ({product}:ProductRedirectIconProps) => {
    if (!product.redirectToParent || !product.parentProductKeyword) {
        return null;
    }
    const url = `/products/${encodeURIComponent(product.parentProductKeyword)}`

    return (
        <Link to={url} onClick={(e) => e.stopPropagation()}>
            {product.parentProductKeyword}
        </Link>
    )
}

export default ProductRedirectIcon;
