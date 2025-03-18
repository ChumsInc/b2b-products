
import {fetchJSON} from "chums-ui-utils";
import {ItemSearchFilter, ItemSearchRecord} from "@/types/item-search";

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


export async function loadItemSearchAPI(search: string, filter?: ItemSearchFilter, signal?: AbortSignal): Promise<ItemSearchRecord[]> {
    try {
        if (!search) {
            return [];
        }
        const params = parseSearchParams(search, filter)
        const url = `/api/search/item/chums/?${params.toString()}`
        const res = await fetchJSON<{ result: ItemSearchRecord[] }>(url, {signal, cache: 'no-cache'});
        return res?.result ?? []
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log("loadItemSearch()", error.name, error.message);
            return Promise.reject(error);
        }
        console.error("loadItemSearch()", error);
        return [];
    }
}
