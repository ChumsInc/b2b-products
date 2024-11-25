import {BOMResult} from "../../../types/item-search";
import {fetchJSON} from "chums-components";
import {ProductMixComponent, ProductMixItem} from "b2b-types/src/products";

export async function fetchMixBOM(itemCode: string):Promise<BOMResult|null> {
    try {
        const url = `/api/operations/production/bill/chums/${itemCode}`;
        return await fetchJSON<BOMResult>(url, {cache: 'no-cache'});
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("loadMixBOM()", err.message);
            return Promise.reject(err);
        }
        console.debug("loadMixBOM()", err);
        return Promise.reject(new Error('Error in loadMixBOM()'));
    }
}

export async function postMix(_mix: ProductMixItem): Promise<ProductMixItem|null> {
    try {
        if (!_mix.productId) {
            return Promise.reject(new Error('Invalid Mix: missing value ID'));
        }
        const url = '/api/b2b/products/v2/mix/:productId/:mixID'
            .replace(':productId', encodeURIComponent(_mix.productId))
            .replace(':mixID', encodeURIComponent(_mix.id || ''));
        const method = _mix.id ? 'PUT' : 'POST';
        const res = await fetchJSON<{ mix: ProductMixItem }>(url, {method, body: JSON.stringify(_mix)});
        return res?.mix ?? null;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("postMix()", err.message);
            return Promise.reject(err);
        }
        console.debug("postMix()", err);
        return Promise.reject(new Error('Error in postMix()'));
    }
}

export async function postMixComponent(productId: number, component: ProductMixComponent): Promise<ProductMixItem|null> {
    try {
        if (!productId || !component.mixID) {
            return Promise.reject(new Error('Invalid Mix Component: missing value ID or mix ID'));
        }
        if (!component.colorsId || !component.itemCode) {
            return Promise.reject(new Error('Mix component is missing component.colorsId or component.itemCode'));
        }
        const url = '/api/b2b/products/v2/mix/:productId/:mixID/items'
            .replace(':productId', encodeURIComponent(productId))
            .replace(':mixID', encodeURIComponent(component.mixID));
        const res = await fetchJSON<{ mix: ProductMixItem }>(url, {
            method: 'POST',
            body: JSON.stringify([component])
        });
        return res?.mix ?? null;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("postMixComponent()", err.message);
            return Promise.reject(err);
        }
        console.debug("postMixComponent()", err);
        return Promise.reject(new Error('Error in postMixComponent()'));
    }
}
