import {defaultColorItem} from "@/utils/defaults.ts";

export function newItem(productId: number) {
    return {...defaultColorItem, productId};
}
