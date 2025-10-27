import type {ProductListItem} from "b2b-types";
import type {SortProps} from "chums-types";

export interface ProductFilter {
    showInactive: boolean,
    showUnavailable: boolean;
    hasSalePrice: boolean,
    categoryId: number | null;
    season: string;
}


export interface ProductsListState {
    status: 'idle' | 'loading' | 'rejected';
    loading: boolean;
    search: string;
    filter: ProductFilter;
    sort: SortProps<ProductListItem>;
}
