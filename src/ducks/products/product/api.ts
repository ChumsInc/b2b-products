import {Product} from "b2b-types/src/products";
import {fetchJSON} from "chums-components";
import {BasicProduct} from "b2b-types";
import {isSellAsColorsProduct, isSellAsMixProduct, isSellAsVariantsProduct} from "../utils";
import {defaultProduct} from "./utils";

export async function fetchProduct(keyword: string): Promise<Product> {
    try {
        const url = `/api/b2b/products/v2/keyword/${encodeURIComponent(keyword)}`;
        const res = await fetchJSON<{ products: Product[] }>(url, {cache: 'no-cache'});
        if (!res?.products.length) {
            return {...defaultProduct};
        }
        return res.products[0];
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchProduct()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchProduct()", err);
        return Promise.reject(new Error('Error in fetchProduct()'));
    }
}

export async function postProduct(_product: Product): Promise<Product|null> {
    try {
        if (!_product.keyword) {
            return Promise.reject(new Error('Keyword must be provided.'));
        }
        const url = `/api/b2b/products/v2/${encodeURIComponent(_product.id)}`;
        const method = _product.id === 0 ? 'POST' : 'PUT';
        let baseProduct: BasicProduct = {..._product};
        if (isSellAsVariantsProduct(_product)) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {variants, ...p} = _product
            baseProduct = p;
        } else if (isSellAsMixProduct(_product)) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {mix, ...p} = _product;
            baseProduct = p;
        } else if (isSellAsColorsProduct(_product)) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {items, ...p} = _product;
            baseProduct = p;
        }
        delete baseProduct.images;

        const body = JSON.stringify(baseProduct);
        const res = await fetchJSON<{ product: Product }>(url, {method, body});
        return res?.product ?? null;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("postProduct()", err.message);
            return Promise.reject(err);
        }
        console.debug("postProduct()", err);
        return Promise.reject(new Error('Error in postProduct()'));
    }
}
