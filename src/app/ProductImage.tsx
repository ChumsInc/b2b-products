import React from 'react';
import {ProductImageSize} from "../types/product";
import {parseColor} from "../utils";
import classNames from "classnames";

export interface ProductImage {
    filename: string|null,
    itemCode: string,
    colorCode?: string,
    size: ProductImageSize,
    className?: string,
}

const ProductImage:React.FC<ProductImage> = ({filename, itemCode, colorCode, size, className}) => {
    if (!filename) {
        filename = 'missing.png';
    }
    const image = parseColor(filename, colorCode);
    const src = `/images/products/${size}/${image}`;
    return (
        <figure className={classNames('product-image', className, `image-${size}`)}>
            <img src={src} alt={itemCode || filename} loading="lazy" className="img-thumbnail" />
            <figcaption className="figure-caption">
                <div><strong>{itemCode}</strong></div>
                <div className="filename" title={filename}>{image}</div>
            </figcaption>
        </figure>
    )

}

export default ProductImage;
