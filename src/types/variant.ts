import type {ProductVariant} from "chums-types/b2b";

export type VariantSortArgs = Pick<ProductVariant, 'parentProductID'|'id'|'priority'>
