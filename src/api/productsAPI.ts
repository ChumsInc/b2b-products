import {fetchJSON} from 'chums-components';
import Debug from "debug";
import {BasicProduct, ProductAlternateImage, ProductListItem} from "b2b-types";
import {
    Product,
    ProductColorItem,
    ProductColorVariant,
    ProductMixComponent,
    ProductMixItem,
    ProductVariant
} from "b2b-types/src/products";
import {defaultProduct} from "../defaults";
import {isSellAsColorsProduct, isSellAsMixProduct, isSellAsVariantsProduct} from "../ducks/products/utils";
import {BOMResult} from "../types/item-search";
import {VariantSortArgs} from "../types/variant";

const debug = Debug('chums:api:productsAPI');

export const manufacturerId__CHUMS = 12;

export async function fetchProducts(): Promise<ProductListItem[]> {
    try {
        const url = `/api/b2b/products/v2/list/${manufacturerId__CHUMS}`;
        const {products} = await fetchJSON<{ products: ProductListItem[] }>(url, {cache: 'no-cache'});
        return products;
    } catch (err: unknown) {
        if (err instanceof Error) {
            debug("fetchProducts()", err.message);
            return Promise.reject(err);
        }
        debug("fetchProducts()", err);
        return Promise.reject(new Error('Error in fetchProducts()'));
    }
}

export async function fetchProduct(keyword: string): Promise<Product> {
    try {
        const url = `/api/b2b/products/v2/keyword/${encodeURIComponent(keyword)}`;
        const {products} = await fetchJSON<{ products: Product[] }>(url, {cache: 'no-cache'});
        if (!products.length) {
            return {...defaultProduct};
        }
        return products[0];
    } catch (err: unknown) {
        if (err instanceof Error) {
            debug("fetchProduct()", err.message);
            return Promise.reject(err);
        }
        debug("fetchProduct()", err);
        return Promise.reject(new Error('Error in fetchProduct()'));
    }
}

export async function postProduct(_product: Product): Promise<Product> {
    try {
        if (!_product.keyword) {
            return Promise.reject(new Error('Keyword must be provided.'));
        }
        const url = `/api/b2b/products/v2/${encodeURIComponent(_product.id)}`;
        const method = _product.id === 0 ? 'POST' : 'PUT';
        let baseProduct: BasicProduct = {..._product};
        if (isSellAsVariantsProduct(_product)) {
            const {variants, ...p} = _product
            baseProduct = p;
        } else if (isSellAsMixProduct(_product)) {
            const {mix, ...p} = _product;
            baseProduct = p;
        } else if (isSellAsColorsProduct(_product)) {
            const {items, ...p} = _product;
            baseProduct = p;
        }
        delete baseProduct.images;

        const body = JSON.stringify(baseProduct);
        const {product} = await fetchJSON<{ product: Product }>(url, {method, body});
        return product;
    } catch (err: unknown) {
        if (err instanceof Error) {
            debug("postProduct()", err.message);
            return Promise.reject(err);
        }
        debug("postProduct()", err);
        return Promise.reject(new Error('Error in postProduct()'));
    }
}

export async function postVariant(_variant: ProductVariant): Promise<ProductVariant | null> {
    try {
        if (!_variant.parentProductID) {
            return Promise.reject(new Error('Invalid parentProductID'));
        }
        const url = `/api/b2b/products/v2/variants/${_variant.parentProductID}/${_variant.id || ''}`;
        const method = _variant.id ? 'PUT' : 'POST';
        const {variant} = await fetchJSON<{ variant: ProductVariant }>(url, {method, body: JSON.stringify(_variant)});
        return variant ?? null;
    } catch (err: unknown) {
        if (err instanceof Error) {
            debug("postVariant()", err.message);
            return Promise.reject(err);
        }
        debug("postVariant()", err);
        return Promise.reject(new Error('Error in postVariant()'));
    }
}



export async function putVariantSort(_variants: VariantSortArgs[]): Promise<ProductVariant[]> {
    try {
        if (_variants.length === 0) {
            return [];
        }
        const url = `/api/b2b/products/v2/variants/${_variants[0].parentProductID}/sort`;
        const body = _variants.map(v => ({parentProductID: v.parentProductID, id: v.id, priority: v.priority}));
        const {variants} = await fetchJSON<{ variants: ProductVariant[] }>(url, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
        return variants;
    } catch (err: unknown) {
        if (err instanceof Error) {
            debug("putVariantSortAPI()", err.message);
            return Promise.reject(err);
        }
        debug("putVariantSortAPI()", err);
        return Promise.reject(new Error('Error in putVariantSortAPI()'));
    }
}

export async function putDefaultVariant(variant: ProductVariant): Promise<ProductVariant[]> {
    try {
        if (!variant.id || !variant.parentProductID) {
            return Promise.reject(new Error('invalid variant'));
        }
        const url = `/api/b2b/products/v2/variants/${variant.parentProductID}/${variant.id}/default`;
        const {variants} = await fetchJSON<{ variants: ProductVariant[] }>(url, {method: 'PUT'});
        return variants;
    } catch (err: unknown) {
        if (err instanceof Error) {
            debug("putVariantSortAPI()", err.message);
            return Promise.reject(err);
        }
        debug("putVariantSortAPI()", err);
        return Promise.reject(new Error('Error in putVariantSortAPI()'));
    }
}

export async function deleteVariant(_variant: ProductVariant): Promise<ProductVariant[]> {
    try {
        const {parentProductID, id} = _variant;
        if (!id || !parentProductID) {
            return Promise.reject(new Error('Invalid variant, must have ID and parentProductID'));
        }
        const url = `/api/b2b/products/v2/variants/${parentProductID}/${id}`;
        const {variants} = await fetchJSON<{ variants: ProductVariant[] }>(url, {method: 'DELETE'});
        return variants;
    } catch (err: unknown) {
        if (err instanceof Error) {
            debug("deleteVariant()", err.message);
            return Promise.reject(err);
        }
        debug("deleteVariant()", err);
        return Promise.reject(new Error('Error in deleteVariant()'));
    }
}

export async function postColorItem(item: ProductColorVariant) {
    try {
        if (!item.productId || !item.colorCode) {
            return Promise.reject(new Error('Invalid color item - missing product ID or color code'));
        }
        const url = `/api/b2b/products/items/${item.productId}/${item.id || ''}`;
        const method = item.id === 0 ? 'POST' : 'PUT';
        const {items} = await fetchJSON<{ items: ProductColorVariant[] }>(url, {method, body: JSON.stringify(item)});
        return items;
    } catch (err: unknown) {
        if (err instanceof Error) {
            debug("postColorItem()", err.message);
            return Promise.reject(err);
        }
        debug("postColorItem()", err);
        return Promise.reject(new Error('Error in postColorItem()'));
    }
}

export async function deleteColorItem(item: ProductColorItem): Promise<ProductColorItem[]> {
    try {
        if (!item.productId || !item.id) {
            return Promise.reject(new Error('Invalid color item - missing product ID or item ID'));
        }
        const url = `/api/b2b/products/items/${item.productId}/${item.id}`;
        const method = 'DELETE';
        const {items} = await fetchJSON<{ items: ProductColorItem[] }>(url, {method});
        return items;
    } catch (err: unknown) {
        if (err instanceof Error) {
            debug("deleteColorItem()", err.message);
            return Promise.reject(err);
        }
        debug("deleteColorItem()", err);
        return Promise.reject(new Error('Error in postColorItem()'));
    }
}

export async function postMix(_mix: ProductMixItem): Promise<ProductMixItem> {
    try {
        if (!_mix.productId) {
            return Promise.reject(new Error('Invalid Mix: missing product ID'));
        }
        const url = '/api/b2b/products/v2/mix/:productId/:mixID'
            .replace(':productId', encodeURIComponent(_mix.productId))
            .replace(':mixID', encodeURIComponent(_mix.id || ''));
        const method = _mix.id ? 'PUT' : 'POST';
        const {mix} = await fetchJSON<{ mix: ProductMixItem }>(url, {method, body: JSON.stringify(_mix)});
        return mix;
    } catch (err: unknown) {
        if (err instanceof Error) {
            debug("postMix()", err.message);
            return Promise.reject(err);
        }
        debug("postMix()", err);
        return Promise.reject(new Error('Error in postMix()'));
    }
}

export async function postMixComponent(productId: number, component: ProductMixComponent): Promise<ProductMixItem> {
    try {
        if (!productId || !component.mixID) {
            return Promise.reject(new Error('Invalid Mix Component: missing product ID or mix ID'));
        }
        if (!component.colorsId || !component.itemCode) {
            return Promise.reject(new Error('Mix component is missing component.colorsId or component.itemCode'));
        }
        const url = '/api/b2b/products/v2/mix/:productId/:mixID/items'
            .replace(':productId', encodeURIComponent(productId))
            .replace(':mixID', encodeURIComponent(component.mixID));
        const {mix} = await fetchJSON<{ mix: ProductMixItem }>(url, {
            method: 'POST',
            body: JSON.stringify([component])
        });
        return mix;
    } catch (err: unknown) {
        if (err instanceof Error) {
            debug("postMixComponent()", err.message);
            return Promise.reject(err);
        }
        debug("postMixComponent()", err);
        return Promise.reject(new Error('Error in postMixComponent()'));
    }
}

export async function fetchAltImages(productId: number): Promise<ProductAlternateImage[]> {
    try {
        const url = '/api/b2b/products/v2/images/product/:productId'
            .replace(':productId', encodeURIComponent(productId));
        const {images} = await fetchJSON<{ images: ProductAlternateImage[] }>(url, {cache: 'no-cache'});
        return images;
    } catch (err: unknown) {
        if (err instanceof Error) {
            debug("fetchAltImages()", err.message);
            return Promise.reject(err);
        }
        debug("fetchAltImages()", err);
        return Promise.reject(new Error('Error in fetchAltImages()'));
    }
}

export async function postAltImage(image: ProductAlternateImage): Promise<ProductAlternateImage[]> {
    try {
        if (!image.productId || !image.image) {
            return Promise.reject(new Error('Invalid Image: missing product ID or filename'));
        }
        const url = '/api/b2b/products/v2/images/:id'.replace(':id', encodeURIComponent(image.id === 0 ? '' : image.id));
        const method = image.id === 0 ? 'POST' : 'PUT';
        const {images} = await fetchJSON<{ images: ProductAlternateImage[] }>(url, {
            method,
            body: JSON.stringify(image)
        });
        return images;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("postAltImage()", err.message);
            return Promise.reject(err);
        }
        console.debug("postAltImage()", err);
        return Promise.reject(new Error('Error in postAltImage()'));
    }
}

export async function deleteAltImage(image: ProductAlternateImage): Promise<ProductAlternateImage[]> {
    try {
        if (!image.productId || !image.image || !image.id) {
            return Promise.reject(new Error('Invalid Image: missing ID, product ID or filename'));
        }
        const url = '/api/b2b/products/v2/image/:productId/:id'
            .replace(':productId', encodeURIComponent(image.productId))
            .replace(':id', encodeURIComponent(image.id));
        const {images} = await fetchJSON<{ images: ProductAlternateImage[] }>(url, {method: 'DELETE'});
        return images;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("deleteAltImage()", err.message);
            return Promise.reject(err);
        }
        console.debug("deleteAltImage()", err);
        return Promise.reject(new Error('Error in postAltImage()'));
    }
}

export async function fetchMixBOM(itemCode: string):Promise<BOMResult> {
    try {
        const url = `/api/operations/production/bill/chums/${itemCode}`;
        return await fetchJSON<BOMResult>(url, {cache: 'no-cache'});
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("loadMixBOM()", err.message);
            return Promise.reject(err);
        }
        console.debug("loadMixBOM()", err);
        return Promise.reject(new Error('Error in loadMixBOM()'));
    }
}
