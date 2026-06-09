import ColorSwatch, {type ColorSwatchProps} from "@/components/colors/ColorSwatch.tsx";
import {useAppSelector} from "@/app/configureStore.ts";
import {selectCurrentProduct} from "@/ducks/products/productSlice.ts";


export default function ProductColorSwatch({colorCode, swatchFormat, ...rest }:ColorSwatchProps) {
    const product = useAppSelector(selectCurrentProduct);
    return (
        <ColorSwatch colorCode={colorCode} className="border rounded-1"
                     swatchFormat={swatchFormat ?? product?.additionalData?.swatch_format}
                     {...rest} />
    )
}
