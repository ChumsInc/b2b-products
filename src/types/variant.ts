import type {ProductVariant} from "b2b-types";

export type VariantSortArgs = Pick<ProductVariant, 'parentProductID'|'id'|'priority'>
