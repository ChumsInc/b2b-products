import {ProductSellAsColors, ProductSellAsMix, ProductSellAsSelf, ProductSellAsVariants} from "b2b-types";
import {ProductFilter} from "./actionTypes";
import {ProductVariantListSorterProps} from "../../types/product";

export const defaultFilter: ProductFilter = {
    isActive: true,
    isAvailableForSale: false,
    hasSalePrice: false,
};

export const SELL_AS_VARIANTS: ProductSellAsVariants = 0;
export const SELL_AS_SELF: ProductSellAsSelf = 1;
export const SELL_AS_MIX: ProductSellAsMix = 3;
export const SELL_AS_COLORS: ProductSellAsColors = 4;


export const mixColor = '#4e9b5b';
export const colorsColor = '#ce0e2d';
export const selfColor = 'primary';
export const variantsColor = '#a9a8a8';

export const defaultVariantSorterProps: ProductVariantListSorterProps = {
    field: 'isDefaultVariant',
    ascending: true,
}

export const variantPrioritySort: ProductVariantListSorterProps = {
    field: 'priority',
    ascending: true,
}
