import type {ProductMixComponent, ProductMixItem} from "chums-types/b2b";
import {defaultProductBase} from "./product-utils.ts";

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
