import {Product} from "b2b-types";
import {ProductListItem} from "b2b-types/src/products";
import {SELL_AS_COLORS, SELL_AS_MIX, SELL_AS_SELF} from "./constants";

export const productListItem = (product:Product):ProductListItem => {
    const {id, keyword, itemCode, status, name, product_season_id, image, parentProductKeyword, sellAs, variants,
        redirectToParent, season_code, manufacturersId, availableForSale, additionalData, parentProductID
    } = product;
    const variantsCount = variants?.filter(v => v.status && !!v.product?.status).length || 0;
    const selfCount = variants?.filter(v => v.status && v.product?.status && v.product.sellAs === SELL_AS_SELF).length || 0;
    const mixesCount = variants?.filter(v => v.status && v.product?.status && v.product.sellAs === SELL_AS_MIX).length || 0;
    const colorsCount = variants?.filter(v => v.status && v.product?.status && v.product.sellAs === SELL_AS_COLORS)
        .reduce((pv, variant) => pv + (variant?.product?.items || []).filter(i => i.status).length | 0, 0) || 0;
    return {
        id,
        keyword,
        itemCode,
        status,
        name,
        product_season_id,
        image,
        salePrice: undefined,
        maxPrice: undefined,
        parentProductKeyword,
        sellAs,
        minPrice: undefined,
        selfCount,
        defaultParentProductsId: parentProductID || 0,
        mixesCount,
        redirectToParent,
        colorsCount,
        season_code,
        manufacturersId,
        availableForSale,
        variantsCount
    }
}
