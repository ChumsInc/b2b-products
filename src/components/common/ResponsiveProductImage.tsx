import React, {ImgHTMLAttributes} from "react";
import classNames from "classnames";

export interface ResponsiveProductImageProps extends ImgHTMLAttributes<HTMLImageElement>{
    path?: string|number;
    filename?: string;
}
export default function ResponsiveProductImage({path, filename, src, className, alt, ...rest}: ResponsiveProductImageProps) {
    const imgSrc = src ?? `/images/products/${path ?? 80}/${filename}`;
    const imgClassName = classNames(className, `img-fluid`);
    const imgAlt = alt ?? filename;
    return (
        <img src={imgSrc} className={imgClassName} alt={imgAlt} {...rest} />
    )

}
