import type {ProductVariant} from "b2b-types";
import {fetchJSON} from "chums-ui-utils";
import type {VariantSortArgs} from "@/types/variant.ts";

export async function deleteVariant(_variant: ProductVariant): Promise<ProductVariant[]> {
    try {
        const {parentProductID, id} = _variant;
        if (!id || !parentProductID) {
            return Promise.reject(new Error('Invalid productVariants, must have ID and parentProductID'));
        }
        const url = `/api/b2b/products/v2/variants/${parentProductID}/${id}.json`;
        const res = await fetchJSON<{ variants: ProductVariant[] }>(url, {method: 'DELETE'});
        return res?.variants ?? [];
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("deleteVariant()", err.message);
            return Promise.reject(err);
        }
        console.debug("deleteVariant()", err);
        return Promise.reject(new Error('Error in deleteVariant()'));
    }
}

export async function postVariant(_variant: ProductVariant): Promise<ProductVariant | null> {
    try {
        if (!_variant.parentProductID) {
            return Promise.reject(new Error('Invalid parentProductID'));
        }
        const url = _variant.id === 0
            ? `/api/b2b/products/v2/variants/${_variant.parentProductID}.json`
            : `/api/b2b/products/v2/variants/${_variant.parentProductID}/${_variant.id}.json`;
        const method = _variant.id ? 'PUT' : 'POST';
        const res = await fetchJSON<{ variant: ProductVariant }>(url, {method, body: JSON.stringify(_variant)});
        return res?.variant ?? null;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("postVariant()", err.message);
            return Promise.reject(err);
        }
        console.debug("postVariant()", err);
        return Promise.reject(new Error('Error in postVariant()'));
    }
}

export async function putVariantSort(_variants: VariantSortArgs[]): Promise<ProductVariant[]> {
    try {
        if (_variants.length === 0) {
            return [];
        }
        const url = `/api/b2b/products/v2/variants/${_variants[0].parentProductID}/sort.json`;
        const body = _variants.map(v => ({parentProductID: v.parentProductID, id: v.id, priority: v.priority}));
        const res = await fetchJSON<{ variants: ProductVariant[] }>(url, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
        return res?.variants ?? [];
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("putVariantSortAPI()", err.message);
            return Promise.reject(err);
        }
        console.debug("putVariantSortAPI()", err);
        return Promise.reject(new Error('Error in putVariantSortAPI()'));
    }
}

export async function putDefaultVariant(variant: ProductVariant): Promise<ProductVariant[]> {
    try {
        if (!variant.id || !variant.parentProductID) {
            return Promise.reject(new Error('invalid productVariants'));
        }
        const url = `/api/b2b/products/v2/variants/${variant.parentProductID}/${variant.id}/default.json`;
        const res = await fetchJSON<{ variants: ProductVariant[] }>(url, {method: 'PUT'});
        return res?.variants ?? [];
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("putVariantSortAPI()", err.message);
            return Promise.reject(err);
        }
        console.debug("putVariantSortAPI()", err);
        return Promise.reject(new Error('Error in putVariantSortAPI()'));
    }
}
