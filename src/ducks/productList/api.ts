import type {ProductListItem} from "b2b-types";
import {fetchJSON} from "chums-ui-utils";

export const manufacturerId__CHUMS = 12;

export async function fetchProducts(): Promise<ProductListItem[]> {
    try {
        const url = `/api/b2b/products/v2/list.json`;
        const res = await fetchJSON<{ products: ProductListItem[] }>(url, {cache: 'no-cache'});
        return res?.products ?? [];
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchProducts()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchProducts()", err);
        return Promise.reject(new Error('Error in fetchProducts()'));
    }
}
