import {fetchJSON} from 'chums-components';
import Debug from "debug";
import {ProductListItem} from "b2b-types";
import {
    Product,
    ProductColorItem,
    ProductColorVariant,
    ProductMixComponent,
    ProductMixItem,
    ProductVariant
} from "b2b-types/src/products";
import {defaultProduct} from "../defaults";

const debug = Debug('chums:api:productsAPI');

export const manufacturerId__CHUMS = 12;

export async function fetchProductsAPI():Promise<ProductListItem[]> {
    try {
        const url = `/api/b2b/products/v2/list/${manufacturerId__CHUMS}`;
        const {products} = await fetchJSON<{products: ProductListItem[]}>(url);
        return products;
    } catch(err:unknown) {
        if (err instanceof Error) {
            debug("fetchProducts()", err.message);
            return Promise.reject(err);
        }
        debug("fetchProducts()", err);
        return Promise.reject(new Error('Error in fetchProducts()'));
    }
}

export async function fetchProductAPI(keyword: string):Promise<Product> {
    try {
        const url = `/api/b2b/products/v2/keyword/${encodeURIComponent(keyword)}`;
        const {products} = await fetchJSON<{products: Product[]}>(url);
        if (!products.length) {
            return {...defaultProduct};
        }
        return products[0];
    } catch(err:unknown) {
        if (err instanceof Error) {
            debug("fetchProduct()", err.message);
            return Promise.reject(err);
        }
        debug("fetchProduct()", err);
        return Promise.reject(new Error('Error in fetchProduct()'));
    }
}

export async function postProductAPI(_product:Product):Promise<Product> {
    try {
        if (!_product.keyword) {
            return Promise.reject(new Error('Keyword must be provided.'));
        }
        const url = `/api/b2b/products/v2/${encodeURIComponent(_product.id)}`;
        const method = _product.id === 0 ? 'POST' : 'PUT';
        const data = {..._product};
        delete data.variants;
        delete data.images;
        delete data.items;
        delete data.mix;

        const body = JSON.stringify(data);
        const {product} = await fetchJSON<{product:Product}>(url, {method, body});
        return product;
    } catch(err:unknown) {
        if (err instanceof Error) {
            debug("postProduct()", err.message);
            return Promise.reject(err);
        }
        debug("postProduct()", err);
        return Promise.reject(new Error('Error in postProduct()'));
    }
}

export async function saveVariantAPI(_variant:ProductVariant):Promise<ProductVariant|undefined> {
    try {
        if (!_variant.parentProductID) {
            return Promise.reject(new Error('Invalid parentProductID'));
        }
        const url = `/api/b2b/products/v2/variants/${_variant.parentProductID}/${_variant.id || ''}`;
        const method = _variant.id ? 'PUT' : 'POST';
        const {variant} = await fetchJSON<{variant:ProductVariant}>(url, {method, body: JSON.stringify(_variant)});
        return variant;
    } catch(err:unknown) {
        if (err instanceof Error) {
            debug("postVariant()", err.message);
            return Promise.reject(err);
        }
        debug("postVariant()", err);
        return Promise.reject(new Error('Error in postVariant()'));
    }
}

export async function saveVariantSortAPI(_variants:ProductVariant[]):Promise<ProductVariant[]> {
    try {
        if (_variants.length === 0) {
            return [];
        }
        const url = `/api/b2b/products/v2/variants/${_variants[0].parentProductID}/sort`;
        const body = _variants.map(v => ({parentProductID: v.parentProductID, id: v.id, priority: v.priority}));
        const {variants} = await fetchJSON<{ variants: ProductVariant[] }>(url, {method: 'PUT', body: JSON.stringify(body)});
        return variants;
    } catch(err:unknown) {
        if (err instanceof Error) {
            debug("putVariantSortAPI()", err.message);
            return Promise.reject(err);
        }
        debug("putVariantSortAPI()", err);
        return Promise.reject(new Error('Error in putVariantSortAPI()'));
    }
}

export async function setDefaultVariantAPI(variant:ProductVariant):Promise<ProductVariant[]> {
    try {
        if (!variant.id || !variant.parentProductID) {
            return Promise.reject(new Error('invalid variant'));
        }
        const url = `/api/b2b/products/v2/variants/${variant.parentProductID}/${variant.id}/default`;
        const {variants} = await fetchJSON<{ variants: ProductVariant[] }>(url, {method: 'PUT'});
        return variants;
    } catch(err:unknown) {
        if (err instanceof Error) {
            debug("putVariantSortAPI()", err.message);
            return Promise.reject(err);
        }
        debug("putVariantSortAPI()", err);
        return Promise.reject(new Error('Error in putVariantSortAPI()'));
    }
}

export async function deleteVariantAPI(_variant:ProductVariant):Promise<ProductVariant[]> {
    try {
        const {parentProductID, id} = _variant;
        if (!id || !parentProductID) {
            return Promise.reject(new Error('Invalid variant, must have ID and parentProductID'));
        }
        const url = `/api/b2b/products/v2/variants/${parentProductID}/${id}`;
        const {variants} = await fetchJSON<{variants:ProductVariant[]}>(url, {method: 'DELETE'});
        return variants;
    } catch(err:unknown) {
        if (err instanceof Error) {
            debug("deleteVariantAPI()", err.message);
            return Promise.reject(err);
        }
        debug("deleteVariantAPI()", err);
        return Promise.reject(new Error('Error in deleteVariantAPI()'));
    }
}

export async function saveColorItemAPI(item:ProductColorVariant) {
    try {
        if (!item.productId || !item.colorCode) {
            return Promise.reject(new Error('Invalid color item - missing product ID or color code'));
        }
        const url = `/api/b2b/products/items/${item.productId}/${item.id || ''}`;
        const method = item.id === 0 ? 'POST' : 'PUT';
        const {items} = await fetchJSON<{items:ProductColorVariant[]}>(url, {method, body: JSON.stringify(item)});
        return items;
    } catch(err:unknown) {
        if (err instanceof Error) {
            debug("saveColorItemAPI()", err.message);
            return Promise.reject(err);
        }
        debug("saveColorItemAPI()", err);
        return Promise.reject(new Error('Error in saveColorItemAPI()'));
    }
}

export async function deleteColorItemAPI(item:ProductColorItem):Promise<ProductColorItem[]> {
    try {
        if (!item.productId || !item.id) {
            return Promise.reject(new Error('Invalid color item - missing product ID or item ID'));
        }
        const url = `/api/b2b/products/items/${item.productId}/${item.id}`;
        const method = 'DELETE';
        const {items} = await fetchJSON<{items:ProductColorItem[]}>(url, {method});
        return items;
    } catch(err:unknown) {
        if (err instanceof Error) {
            debug("saveColorItemAPI()", err.message);
            return Promise.reject(err);
        }
        debug("saveColorItemAPI()", err);
        return Promise.reject(new Error('Error in saveColorItemAPI()'));
    }
}

export async function saveMixAPI(_mix:ProductMixItem):Promise<ProductMixItem> {
    try {
        if (!_mix.productId) {
            return Promise.reject(new Error('Invalid Mix: missing product ID'));
        }
        const url = '/api/b2b/products/v2/mix/:productId/:mixID'
            .replace(':productId', encodeURIComponent(_mix.productId))
            .replace(':mixID', encodeURIComponent(_mix.id || ''));
        const method = _mix.id ? 'PUT' : 'POST';
        const {mix} = await fetchJSON<{mix:ProductMixItem}>(url, {method, body: JSON.stringify(_mix)});
        return mix;
    } catch(err:unknown) {
        if (err instanceof Error) {
            debug("saveMixAPI()", err.message);
            return Promise.reject(err);
        }
        debug("saveMixAPI()", err);
        return Promise.reject(new Error('Error in saveMixAPI()'));
    }
}

export async function saveMixComponentAPI(productId: number, component:ProductMixComponent):Promise<ProductMixItem> {
    try {
        if (!productId || !component.mixID) {
            return Promise.reject(new Error('Invalid Mix Component: missing product ID or mix ID'));
        }
        const url = '/api/b2b/products/v2/mix/:productId/:mixID/items'
            .replace(':productId', encodeURIComponent(productId))
            .replace(':mixID', encodeURIComponent(component.mixID));
        const {mix} = await fetchJSON<{mix: ProductMixItem}>(url, {method: 'POST', body:JSON.stringify([component])});
        return mix;
    } catch(err:unknown) {
        if (err instanceof Error) {
            debug("saveMixComponents()", err.message);
            return Promise.reject(err);
        }
        debug("saveMixComponents()", err);
        return Promise.reject(new Error('Error in saveMixComponents()'));
    }
}
