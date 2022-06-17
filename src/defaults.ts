import {Product, ProductBase, ProductColor, ProductColorVariant, ProductVariant} from "b2b-types";
import {ProductFilter} from "./ducks/products/actionTypes";
import {ProductColorItem, ProductMixComponent, ProductMixItem} from "b2b-types/src/products";


export const defaultColor: ProductColor = {
    id: 0,
    code: '',
    name: '',
}


export const defaultProductBase:ProductBase = {
    id: 0,
    status: true,
    itemCode: '',
}

export const defaultProduct:Product = {
    ...defaultProductBase,
    QuantityAvailable: 0,
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
    sellAs: 0,
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

export const defaultVariant:ProductVariant = {

    id: 0,
    parentProductID: 0,
    variantProductID: 0,
    title: '',
    isDefaultVariant: false,
    status: true,
    priority: 0,
}

export const defaultColorItem:ProductColorItem = {
    ...defaultProductBase,
    productId: 0,
    colorCode: '',
    colorName: '',
    colorsId: 0,
    color: {...defaultColor}
}

export const defaultMixItem:ProductMixItem = {
    ...defaultProductBase,
    productId: 0,
    itemCode: '',
    items: [],
    mixName: '',
}

export const defaultMixComponent:ProductMixComponent = {
    id: 0,
    mixID: 0,
    itemCode: '',
    colorsId: 0,
    color_code: '',
}
