import {Tab} from "chums-components";

export interface TabMap {
    [key:string]: Tab,
}

export interface AppTabMap extends TabMap {
    products: Tab,
    colors: Tab,
}
