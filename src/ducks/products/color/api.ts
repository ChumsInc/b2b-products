import {ProductColorItem, ProductColorVariant} from "b2b-types/src/products";
import {fetchJSON} from "chums-components";

export async function postColorItem(item: ProductColorVariant): Promise<ProductColorVariant[]> {
    try {
        if (!item.productId || !item.colorCode) {
            return Promise.reject(new Error('Invalid color item - missing value ID or color code'));
        }
        const url = `/api/b2b/products/items/${item.productId}/${item.id || ''}`;
        const method = item.id === 0 ? 'POST' : 'PUT';
        const res = await fetchJSON<{ items: ProductColorVariant[] }>(url, {method, body: JSON.stringify(item)});
        return res?.items ?? [];
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("postColorItem()", err.message);
            return Promise.reject(err);
        }
        console.debug("postColorItem()", err);
        return Promise.reject(new Error('Error in postColorItem()'));
    }
}

export async function deleteColorItem(item: ProductColorItem): Promise<ProductColorItem[]> {
    try {
        if (!item.productId || !item.id) {
            return Promise.reject(new Error('Invalid color item - missing value ID or item ID'));
        }
        const url = `/api/b2b/products/items/${item.productId}/${item.id}`;
        const method = 'DELETE';
        const res = await fetchJSON<{ items: ProductColorItem[] }>(url, {method});
        return res?.items ?? [];
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("deleteColorItem()", err.message);
            return Promise.reject(err);
        }
        console.debug("deleteColorItem()", err);
        return Promise.reject(new Error('Error in postColorItem()'));
    }
}
