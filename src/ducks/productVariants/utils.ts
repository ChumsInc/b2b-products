import type {ProductVariant} from "b2b-types";

export const variantSortKey = (list: ProductVariant[]) => {
    return list
        .map(v => v.id).join(':');
}
