import type {ProductVariant} from "b2b-types";
import {variantListSorter} from "@/ducks/products/utils/sorter.ts";

export const variantSortKey = (list: ProductVariant[]) => {
    return list
        .map(v => v.id).join(':');
}

export function getCurrentSort(list: Record<number, ProductVariant>): string {
    return variantSortKey(Object.values(list).sort(variantListSorter({field: "priority", ascending: true})));
}
