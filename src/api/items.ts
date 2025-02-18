import {api} from './base-api'
import {ItemSearchFilter, ItemSearchRecord} from "@/types/item-search";

interface ItemSearchResponse {
    result: ItemSearchRecord[];
}


function parseSearchParams(search: string, filter?: ItemSearchFilter): URLSearchParams {
    const params = new URLSearchParams();
    params.set('search', search)
    if (!filter) {
        return params;
    }
    const {productType, productLine, category, subCategory, baseSKU} = filter;
    if (productType) {
        params.set('ProductType', productType);
    }
    if (productLine) {
        params.set('pl', productLine);
    }
    if (category) {
        params.set('cat', category);
    }
    if (subCategory) {
        params.set('subcat', subCategory);
    }
    if (baseSKU) {
        params.set('sku', baseSKU);
    }
    return params;
}

export interface ItemSearchArg extends ItemSearchFilter {
    search: string;
}

export const itemSearchApi = api.injectEndpoints({
    endpoints: (build) => ({
        getItemSearch: build.query<ItemSearchRecord[], ItemSearchArg>({
            query: (arg:ItemSearchArg) => {
                const {search, ...filter} = arg;
                const params = parseSearchParams(search, filter)
                return `/api/search/item/chums/?${params.toString()}`
            },
            transformResponse: (response: ItemSearchResponse) => {
                console.debug(response);
                return response.result ?? []
            },
            providesTags: () => [{type: 'ItemSearch'}]
        })
    })
})
export const {useGetItemSearchQuery, useLazyGetItemSearchQuery} = itemSearchApi;
