import {Product, SellAsColorsProduct, SellAsMixProduct, SellAsVariantsProduct} from "b2b-types/src/products";

import {ProductListItem} from "b2b-types";
import {SELL_AS_COLORS, SELL_AS_MIX, SELL_AS_VARIANTS} from "../../utils";

export function isSellAsVariantsProduct(product:Product): product is SellAsVariantsProduct {
    return (product as SellAsVariantsProduct).sellAs === SELL_AS_VARIANTS;
}

export function isSellAsMixProduct(product:Product): product is SellAsMixProduct {
    return (product as SellAsMixProduct).sellAs === SELL_AS_MIX;
}

export function isSellAsColorsProduct(product:Product): product is SellAsColorsProduct {
    return (product as SellAsColorsProduct).sellAs === SELL_AS_COLORS;
}

export function listItemFromProduct(product:Product):ProductListItem {
    const {id, keyword, name, itemCode, status, sellAs, image, manufacturersId,
        defaultParentProductsId, redirectToParent, availableForSale, product_season_id,
        defaultCategoriesId,
        season_code,
    } = product;
    const variantsCount = isSellAsVariantsProduct(product) ? product.variants.length : 0;
    const selfCount = 0;
    const mixesCount = isSellAsVariantsProduct(product)
        ? product.variants.filter(v => !!v.product && isSellAsMixProduct(v.product)).length
        : 0;
    const colorsCount = isSellAsVariantsProduct(product)
        ? product.variants.filter(v => !!v.product && isSellAsColorsProduct(v.product))
            .map(v => v.product as SellAsColorsProduct)
            .reduce((ct, product) => ct + product.items.filter(i => i.status).length, 0)
        : 0;

    return {
        id,
        keyword,
        name,
        itemCode,
        status,
        sellAs,
        image,
        manufacturersId,
        defaultParentProductsId,
        variantsCount,
        selfCount,
        mixesCount,
        colorsCount,
        redirectToParent,
        availableForSale,
        product_season_id,
        parentProductKeyword: null,
        defaultCategoriesId,
        season_code: season_code,
        seasonAvailable: (product.additionalData?.seasonAvailable ?? false) || !product.season_code,
    }
}
