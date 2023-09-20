import {
    CategoryChildCategory,
    CategoryChildLink,
    CategoryChildProduct,
    CategoryChildSection, Product,
    ProductCategoryChild,
    ProductSellAsColors,
    ProductSellAsMix,
    ProductSellAsSelf,
    ProductSellAsVariants, ProductVariant,
    SellAsSelfProduct
} from "b2b-types";
import {SellAsColorsProduct, SellAsMixProduct, SellAsVariantsProduct} from "b2b-types/src/products";

export const parseColor = (str:string, colorCode:string = ''):string => {
    if (!str) {
        return '';
    }
    colorCode = String(colorCode);

    str = str.replace(/\?/, colorCode);
    colorCode.split('').map(code => {
        str = str.replace(/\*/, code);
    });
    return str.replace(/\*/g, '');
};

export const SELL_AS_SELF: ProductSellAsSelf = 1;
export const SELL_AS_VARIANTS: ProductSellAsVariants = 0;
export const SELL_AS_MIX: ProductSellAsMix = 3;
export const SELL_AS_COLORS: ProductSellAsColors = 4;


export function isCategoryChildSection(child: ProductCategoryChild): child is CategoryChildSection {
    return (child as CategoryChildSection).itemType === 'section';
}

export function isCategoryChildCategory(child: ProductCategoryChild): child is CategoryChildCategory {
    return (child as CategoryChildCategory).itemType === 'category';
}

export function isCategoryChildProduct(child: ProductCategoryChild): child is CategoryChildProduct {
    return (child as CategoryChildProduct).itemType === 'product';
}

export function isCategoryChildLink(child: ProductCategoryChild): child is CategoryChildLink {
    return (child as CategoryChildLink).itemType === 'link';
}

export function isSellAsSelf(product: Product | null): product is SellAsSelfProduct {
    return !!product && (product as SellAsSelfProduct).sellAs === SELL_AS_SELF;
}

export function isSellAsVariants(product: Product | null): product is SellAsVariantsProduct {
    return !!product && (product as SellAsVariantsProduct).sellAs === SELL_AS_VARIANTS;
}

export function isSellAsMix(product: Product | null): product is SellAsMixProduct {
    return !!product && (product as SellAsMixProduct).sellAs === SELL_AS_MIX;
}

export function isSellAsColors(product: Product | null): product is SellAsColorsProduct {
    return !!product && (product as SellAsColorsProduct).sellAs === SELL_AS_COLORS;
}

export const defaultProduct: Product = {
    buffer: null,
    canDome: false,
    canScreenPrint: false,
    dateAvailable: "",
    defaultCategoriesId: 0,
    defaultCategoryKeyword: null,
    defaultColor: "",
    inactiveItem: false,
    materialsId: 0,
    metaTitle: null,
    msrp: null,
    priceCode: null,
    productType: null,
    salesUM: null,
    salesUMFactor: null,
    season_active: null,
    season_available: false,
    season_code: null,
    season_description: null,
    season_teaser: null,
    shipWeight: null,
    stdPrice: null,
    stdUM: null,
    taxClassId: 0,
    upc: null,
    id: 0,
    name: '',
    itemCode: '',
    keyword: '',
    status: true,
    sellAs: SELL_AS_SELF,
    image: '',
    manufacturersId: 12,
    defaultParentProductsId: 0,
    parentProductKeyword: null,
    redirectToParent: false,
    availableForSale: true,
    product_season_id: 0,
    description: '',
    details: '',
    QuantityAvailable: 0,
}


export const defaultVariant:ProductVariant = {
    id: 0,
    parentProductID: 0,
    variantProductID: 0,
    title: '',
    isDefaultVariant: false,
    status: true,
    priority: 0,
}
