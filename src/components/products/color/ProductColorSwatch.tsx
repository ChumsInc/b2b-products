import React from 'react';
import ColorSwatch, {ColorSwatchProps} from "@/components/colors/ColorSwatch";
import {useAppSelector} from "@/components/app/hooks";
import {selectCurrentProduct} from "@/ducks/products/product/selectors";


export default function ProductColorSwatch({colorCode, swatchFormat, ...rest }:ColorSwatchProps) {
    const product = useAppSelector(selectCurrentProduct);
    return (
        <ColorSwatch colorCode={colorCode}
                     swatchFormat={swatchFormat ?? product?.additionalData?.swatch_format}
                     {...rest} />
    )
}
