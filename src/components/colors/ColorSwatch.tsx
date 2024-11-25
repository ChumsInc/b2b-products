import React from 'react';
import classNames from "classnames";
import {parseColor} from "../../utils";

export default function ColorSwatch({className = '', swatchFormat, colorCode}: {
    className?: string;
    colorCode?: string;
    swatchFormat?: string|null;
}) {

    const swatchClassName = classNames(
        className,
        'color-swatch',
        {[parseColor(`color-swatch--${swatchFormat || '?'}`, colorCode)]: !!colorCode}
    )
    return (
        <div className={swatchClassName}/>
    )
}
