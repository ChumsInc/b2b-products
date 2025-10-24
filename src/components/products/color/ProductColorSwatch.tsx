import ColorSwatch, {type ColorSwatchProps} from "@/components/colors/ColorSwatch";
import {useAppSelector} from "@/app/configureStore";
import {selectCurrentProduct} from "@/ducks/products/productSlice.ts";


export default function ProductColorSwatch({colorCode, swatchFormat, ...rest }:ColorSwatchProps) {
    const product = useAppSelector(selectCurrentProduct);
    return (
        <ColorSwatch colorCode={colorCode}
                     swatchFormat={swatchFormat ?? product?.additionalData?.swatch_format}
                     {...rest} />
    )
}
