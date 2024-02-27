import {ProductVariant} from "b2b-types/src/products";

export type VariantSortArgs = Pick<ProductVariant, 'parentProductID'|'id'|'priority'>
