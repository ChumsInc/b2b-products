import type {ProductBase, ProductColor, ProductColorItem, ProductVariant} from "b2b-types";


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
