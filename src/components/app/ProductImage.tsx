import React from 'react';
import {parseColor} from "../../utils";
import classNames from "classnames";

export type ProductImageSize = 80 | 125 | 250 | 400 | 800 | 2048;

export interface ProductImage {
    filename: string|null,
    itemCode: string,
    colorCode?: string,
    size: ProductImageSize,
    className?: string,
}

const ProductImage = ({filename, itemCode, colorCode, size, className}:ProductImage) => {
    if (!filename) {
        filename = 'missing.png';
    }
    const image = parseColor(filename, colorCode);
    const src = `/images/products/${size}/${image}`;
    return (
        <figure className={classNames('product-image', className, `image-${size}`)}>
            <img src={src} alt={itemCode || filename} loading="lazy" className="img-fluid" />
            <figcaption className="figure-caption">
                <div><strong>{itemCode}</strong></div>
                <div className="text-secondary filename" title={filename}>{image}</div>
            </figcaption>
        </figure>
    )

}

export default ProductImage;
