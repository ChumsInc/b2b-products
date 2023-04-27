import Debug from "debug";
import {ProductSeason} from "b2b-types";
import {fetchJSON} from "chums-components";

const debug = Debug('chums:api:seasonsAPI');


export async function fetchSeasons():Promise<ProductSeason[]> {
    try {
        const url = '/node-b2b/products/v2/seasons';
        const {seasons} = await fetchJSON<{seasons:ProductSeason[]}>(url);
        return seasons;
    } catch(err:unknown) {
        if (err instanceof Error) {
            debug("fetchSeasons()", err.message);
            return Promise.reject(err);
        }
        debug("fetchSeasons()", err);
        return Promise.reject(new Error('Error in fetchSeasons()'));
    }
}
