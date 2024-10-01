import {fetchJSON} from 'chums-components';
import {ColorProductUsage, ProductColor} from "b2b-types";
import Debug from "debug";

const debug = Debug('chums:api:colorAPI');

export async function fetchColors():Promise<ProductColor[]> {
    try {
        const url = '/api/b2b/products/colors';
        const res = await fetchJSON<{colors:ProductColor[]}>(url, {cache: 'no-cache'});
        return res?.colors ?? [];
    } catch(err:unknown) {
        if (err instanceof Error) {
            debug("fetchColors()", err.message);
            return Promise.reject(err);
        }
        debug("fetchColors()", err);
        return Promise.reject(new Error('Error in fetchColors()'));
    }
}

export async function postColor(_color:ProductColor):Promise<{list:ProductColor[], color:ProductColor|null }> {
    try {
        const url = '/api/b2b/products/colors';
        const body = JSON.stringify(_color);
        const res = await fetchJSON<{colors:ProductColor[], color: ProductColor}>(url, {method: 'POST', body});
        return {list: res?.colors ?? [], color: res?.color ?? null};
    } catch(err:unknown) {
        if (err instanceof Error) {
            debug("saveColor()", err.message);
            return Promise.reject(err);
        }
        debug("saveColor()", err);
        return Promise.reject(new Error('Error in saveColor()'));
    }
}

export async function fetchWhereUsed(id:number):Promise<ColorProductUsage[]> {
    try {
        const url = `/api/b2b/products/colors/${id}/items`;
        const res = await fetchJSON<{items:ColorProductUsage[]}>(url, {cache: 'no-cache'});
        return res?.items ?? [];
    } catch(err:unknown) {
        if (err instanceof Error) {
            debug("fetchWhereUsed()", err.message);
            return Promise.reject(err);
        }
        debug("fetchWhereUsed()", err);
        return Promise.reject(new Error('Error in fetchWhereUsed()'));
    }
}
