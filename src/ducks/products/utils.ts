import {Product, SellAsColorsProduct, SellAsMixProduct, SellAsVariantsProduct} from "b2b-types/src/products";
import {WritableDraft} from "immer/dist/types/types-external";
import {SELL_AS_COLORS, SELL_AS_MIX, SELL_AS_VARIANTS} from "b2b-types";

export function isSellAsVariantsProduct(product:Product|WritableDraft<Product>): product is SellAsVariantsProduct {
    return (product as SellAsVariantsProduct).sellAs === SELL_AS_VARIANTS;
}

export function isSellAsMixProduct(product:Product): product is SellAsMixProduct {
    return (product as SellAsMixProduct).sellAs === SELL_AS_MIX;
}

export function isSellAsColorsProduct(product:Product): product is SellAsColorsProduct {
    return (product as SellAsColorsProduct).sellAs === SELL_AS_COLORS;
}
