import type {Product, ProductListItem, SellAsColorsProduct, SellAsMixProduct, SellAsVariantsProduct} from "b2b-types";
import {SELL_AS_COLORS, SELL_AS_MIX, SELL_AS_VARIANTS} from "../../../utils.ts";
import Decimal from "decimal.js";

export function isSellAsVariantsProduct(product: Product|null): product is SellAsVariantsProduct {
    return (product as SellAsVariantsProduct).sellAs === SELL_AS_VARIANTS;
}

export function isSellAsMixProduct(product: Product | null): product is SellAsMixProduct {
    if (!product) return false;
    return (product as SellAsMixProduct).sellAs === SELL_AS_MIX;
}

export function isSellAsColorsProduct(product: Product | SellAsColorsProduct|null): product is SellAsColorsProduct {
    return (product as SellAsColorsProduct).sellAs === SELL_AS_COLORS;
}

interface PriceRange {
    min: string | number | null;
    max: string | number | null;
}

export function listItemFromProduct(product: Product): ProductListItem {
    const {
        id, keyword, name, itemCode, status, sellAs, image, manufacturersId,
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

    const prices: PriceRange = isSellAsColorsProduct(product)
        ? product.items
            .filter(i => i.status)
            .reduce((pv, cv) => {
                return {
                    min: !!pv.min
                        ? (new Decimal(cv.msrp ?? 0).lt(pv.min) ? (cv.msrp ?? 0) : pv.min)
                        : (cv.msrp ?? 0),
                    max: !!pv.max
                        ? (new Decimal(cv.msrp ?? 0).gt(pv.max) ? (cv.msrp ?? 0) : pv.max)
                        : (cv.msrp ?? 0)
                }
            }, {min: null, max: null} as PriceRange)
        : {min: product.msrp ?? 0, max: product.msrp ?? 0};
    if (isSellAsColorsProduct(product)) {
        console.debug('listItemFromProduct', prices, product.items.map(item => `${item.itemCode} @ ${item.msrp}`));
    }


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
        minPrice: prices.min ?? 0,
        maxPrice: prices.max ?? 0,
        parentProductKeyword: null,
        defaultCategoriesId,
        season_code: season_code,
        seasonAvailable: (product.additionalData?.seasonAvailable ?? false) || !product.season_code,
        isRedirect: product.additionalData?.isRedirect ?? false,
    }
}
