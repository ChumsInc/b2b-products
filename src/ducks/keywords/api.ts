import {Keyword} from "b2b-types";
import {fetchJSON} from "chums-ui-utils";

export interface FetchKeywordsOptions {
    includeInactive?: boolean;
}
export const fetchKeywords = async (arg: FetchKeywordsOptions):Promise<Keyword[]> => {
    try {
        const params = new URLSearchParams();
        if (arg.includeInactive) {
            params.set('include_inactive', '1')
        }
        const url = `/api/b2b/keywords.json?${params.toString()}`;
        const res = await fetchJSON<{result:Keyword[]}>(url, {cache: 'no-cache'});
        return res?.result ?? [];
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.warn("fetchKeywords()", err.message);
            return Promise.reject(err);
        }
        console.warn("fetchKeywords()", err);
        return Promise.reject(new Error('Error in fetchKeywords()'));
    }
}

export const fetchKeyword = async (arg: string):Promise<Keyword|null> => {
    try {
        const url = `/api/b2b/keywords/${encodeURIComponent(arg)}.json`;
        const res = await fetchJSON<{keyword:Keyword|null}>(url, {cache: 'no-cache'});
        return res?.keyword ?? null;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchKeyword()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchKeyword()", err);
        return Promise.reject(new Error('Error in fetchKeyword()'));
    }
}
