import {Product, ProductBase, ProductColor, ProductVariant} from "b2b-types";
import {ProductColorItem, ProductMixComponent, ProductMixItem} from "b2b-types/src/products";


export const defaultColor: ProductColor = {
    id: 0,
    code: '',
    name: '',
}


export const defaultProductBase: ProductBase = {
    id: 0,
    parentProductID: 0,
    variantProductID: 0,
    itemCode: '',
    status: true,
    msrp: null,
    stdPrice: null,
    priceCode: null,
    stdUM: null,
    salesUM: null,
    salesUMFactor: null,
    shipWeight: null,
    productType: null,
    QuantityAvailable: 0,
    inactiveItem: false,
    buffer: 0,
    timestamp: null,
}

export const defaultProduct: Product = {
    images: [],
    options: undefined,
    anticipatedPrice: undefined,
    ...defaultProductBase,
    additionalData: undefined,
    canDome: false,
    canScreenPrint: false,
    dateAvailable: "",
    defaultCategoriesId: 0,
    defaultCategoryKeyword: null,
    defaultColor: "",
    materialsId: 0,
    metaTitle: null,
    season_active: null,
    season_available: false,
    season_code: null,
    season_description: null,
    season_teaser: null,
    taxClassId: 0,
    upc: null,
    name: '',
    keyword: '',
    sellAs: 1,
    image: '',
    manufacturersId: 12,
    defaultParentProductsId: 0,
    parentProductKeyword: null,
    redirectToParent: false,
    availableForSale: true,
    product_season_id: 0,
    description: '',
    details: ''
}

export const defaultVariant: ProductVariant = {

    id: 0,
    parentProductID: 0,
    variantProductID: 0,
    title: '',
    isDefaultVariant: false,
    status: true,
    priority: 0,
}

export const defaultColorItem: ProductColorItem = {
    ...defaultProductBase,
    productId: 0,
    colorCode: '',
    colorName: '',
    colorsId: 0,
    color: {...defaultColor}
}

export const defaultMixItem: ProductMixItem = {
    ...defaultProductBase,
    productId: 0,
    itemCode: '',
    items: [],
    mixName: '',
}

export const defaultMixComponent: ProductMixComponent = {
    id: 0,
    mixID: 0,
    itemCode: '',
    colorsId: 0,
    color_code: '',
}
