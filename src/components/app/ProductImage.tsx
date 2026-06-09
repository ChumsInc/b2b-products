import {parseColor, productImagePath} from "@/utils/image-utils";
import classNames from "classnames";
import type {ProductImageSize} from "@/types/product-images.ts";



export interface ProductImage {
    filename: string | null,
    itemCode: string,
    colorCode?: string,
    size: ProductImageSize,
    className?: string,
}

export default function ProductImage({filename, itemCode, colorCode, size, className}: ProductImage) {
    if (!filename) {
        filename = 'missing.png';
    }
    const image = parseColor(filename, colorCode);
    const src = productImagePath(image, size);
    return (
        <figure className={classNames('product-image', className, `image-${size}`)}>
            <img src={src} alt={itemCode || filename} loading="lazy" className="img-fluid"/>
            <figcaption className="figure-caption">
                <div><strong>{itemCode}</strong></div>
                <div className="text-secondary filename" title={filename}>{image}</div>
            </figcaption>
        </figure>
    )

}
