import {ProductVariant} from "b2b-types/src/products";
import {variantListSorter} from "@/ducks/products/sorter";

export const variantSortKey = (list:ProductVariant[]) => {
    return list
        .sort(variantListSorter({field:"priority", ascending: true}))
        .map(v => v.id).join(':');
}
