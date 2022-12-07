import {ProductSellAsColors, ProductSellAsMix, ProductSellAsSelf, ProductSellAsVariants} from "b2b-types";
import {ProductVariantListSorterProps} from "../../types/product";


export const defaultVariantSorterProps: ProductVariantListSorterProps = {
    field: 'isDefaultVariant',
    ascending: true,
}
