import type {ProductAlternateImage} from "b2b-types";
import {fetchJSON} from "chums-ui-utils";

export async function deleteAltImage(image: ProductAlternateImage): Promise<ProductAlternateImage[]> {
    try {
        if (!image.productId || !image.image || !image.id) {
            return Promise.reject(new Error('Invalid Image: missing ID, value ID or filename'));
        }
        const url = '/api/b2b/products/v2/image/:productId/:id.json'
            .replace(':productId', encodeURIComponent(image.productId))
            .replace(':id', encodeURIComponent(image.id));
        const res = await fetchJSON<{ images: ProductAlternateImage[] }>(url, {method: 'DELETE'});
        return res?.images ?? [];
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("deleteAltImage()", err.message);
            return Promise.reject(err);
        }
        console.debug("deleteAltImage()", err);
        return Promise.reject(new Error('Error in postAltImage()'));
    }
}

export async function fetchAltImages(productId: number): Promise<ProductAlternateImage[]> {
    try {
        const url = '/api/b2b/products/v2/images/value/:productId'
            .replace(':productId', encodeURIComponent(productId));
        const res = await fetchJSON<{ images: ProductAlternateImage[] }>(url, {cache: 'no-cache'});
        return res?.images ?? [];
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchAltImages()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchAltImages()", err);
        return Promise.reject(new Error('Error in fetchAltImages()'));
    }
}

export async function postAltImage(image: ProductAlternateImage): Promise<ProductAlternateImage[]> {
    try {
        if (!image.productId || !image.image) {
            return Promise.reject(new Error('Invalid Image: missing value ID or filename'));
        }
        const url = image.id === 0
            ? '/api/b2b/products/v2/images.json'
            : '/api/b2b/products/v2/images/:id.json'
                .replace(':id', encodeURIComponent(image.id === 0 ? '' : image.id));
        const method = image.id === 0 ? 'POST' : 'PUT';
        const res = await fetchJSON<{ images: ProductAlternateImage[] }>(url, {
            method,
            body: JSON.stringify(image)
        });
        return res?.images ?? [];
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("postAltImage()", err.message);
            return Promise.reject(err);
        }
        console.debug("postAltImage()", err);
        return Promise.reject(new Error('Error in postAltImage()'));
    }
}
