import {type HTMLAttributes} from 'react';
import classNames from "classnames";
import {parseColor} from "../../utils";
import styled from "@emotion/styled";

const ColorSwatchEl = styled.div`
    min-width: 1rem;
`

export interface ColorSwatchProps extends HTMLAttributes<HTMLDivElement> {
    className?: string;
    colorCode?: string;
    swatchFormat?: string | null;
}

export default function ColorSwatch({className, swatchFormat, colorCode, ...rest}: ColorSwatchProps) {

    const swatchClassName = classNames(
        className,
        'color-swatch',
        {[parseColor(`color-swatch--${swatchFormat || '?'}`, colorCode)]: !!colorCode}
    )
    return (
        <ColorSwatchEl className={swatchClassName} {...rest}/>
    )
}
