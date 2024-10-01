import {WhereUsedResponse} from "./types";
import {fetchJSON} from "chums-components";

export async function fetchWhereUsed(itemCode:string):Promise<WhereUsedResponse> {
    try {
        const params = new URLSearchParams();
        params.set('itemCode', itemCode);
        const url = `/api/b2b/products/where-used?${params.toString()}`;
        const res = await fetchJSON<{ whereUsed: WhereUsedResponse }>(url, {cache: 'no-cache'});
        return res?.whereUsed ?? {};
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchWhereUsed()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchWhereUsed()", err);
        return Promise.reject(new Error('Error in fetchWhereUsed()'));
    }
}
