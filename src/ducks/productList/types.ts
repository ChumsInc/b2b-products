import type {ProductListItem} from "chums-types/b2b";
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
