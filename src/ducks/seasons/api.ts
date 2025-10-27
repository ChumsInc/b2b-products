import Debug from "debug";
import type {ProductSeason} from "b2b-types";
import {fetchJSON} from "chums-ui-utils";

const debug = Debug('chums:api:seasonsAPI');


export async function fetchSeasons():Promise<ProductSeason[]> {
    try {
        const url = '/api/b2b/products/v2/seasons.json';
        const res = await fetchJSON<{seasons:ProductSeason[]}>(url, {cache: 'no-cache'});
        return res?.seasons ?? [];
    } catch(err:unknown) {
        if (err instanceof Error) {
            debug("fetchSeasons()", err.message);
            return Promise.reject(err);
        }
        debug("fetchSeasons()", err);
        return Promise.reject(new Error('Error in fetchSeasons()'));
    }
}
