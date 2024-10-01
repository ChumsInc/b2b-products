import {ProductMixComponent, ProductMixItem} from "b2b-types";
import {defaultProductBase} from "../product/utils";

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
