
export const storeProductListRowsPerPage = 'b2b-products:product:colors:rowsPerPage';
export const storeColorsListRowsPerPage = 'b2b-products:colors:colors:rowsPerPage';
export const storeProductItemsRowsPerPage = 'b2b-products:products:items:rowsPerPage';
export const storeProductImagesRowsPerPage = 'b2b-products:products:images:rowsPerPage';
export const storeMainTab = 'b2b-products:current-tabs';
export const storeWordWrap = 'b2b-products:wordWrap';

export {LocalStore, SessionStore} from "chums-components";


// export class LocalStore {
//     static clear():any {
//         window.localStorage.clear();
//     }
//
//     static getItem(key:string):any {
//         const data = window.localStorage.getItem(key);
//         if (!data) {
//             return null;
//         }
//         try {
//             return JSON.parse(data);
//         } catch(err:unknown) {
//             if (err instanceof Error) {
//                 console.log("getItem()", key, err.message);
//             }
//             return data;
//         }
//     }
//
//     static setItem(key:string, data:any) {
//         window.localStorage.setItem(key, JSON.stringify(data));
//     }
//
//     static removeItem(key:string) {
//         window.localStorage.removeItem(key);
//     }
// }
//
// export class SessionStore {
//     static clear():any {
//         window.sessionStorage.clear();
//     }
//
//     static getItem(key:string):any {
//         const data = window.sessionStorage.getItem(key);
//         if (!data) {
//             return null;
//         }
//         try {
//             return JSON.parse(data);
//         } catch(err:unknown) {
//             if (err instanceof Error) {
//                 console.log("getItem()", key, err.message);
//             }
//             return data;
//         }
//     }
//
//     static setItem(key:string, data:any) {
//         window.sessionStorage.setItem(key, JSON.stringify(data));
//     }
//
//     static removeItem(key:string) {
//         window.sessionStorage.removeItem(key);
//     }
// }
