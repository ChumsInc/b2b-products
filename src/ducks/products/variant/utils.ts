import {ProductVariant} from "b2b-types/src/products";

export const variantSortKey = (list:ProductVariant[]) => list.map(v => v.id).join(':');
