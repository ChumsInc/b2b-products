import {WhereUsed} from "./types";

export const wuKeywordSorter = (a:WhereUsed, b:WhereUsed):number => {
    return a.keyword === b.keyword
        ? (a.id - b.id)
        : (a.keyword > b.keyword ? 1 : -1)
}
