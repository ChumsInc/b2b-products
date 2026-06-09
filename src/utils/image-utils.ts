import type {ProductImageSize} from "@/types/product-images.ts";

export const parseColor = (str: string, colorCode: string = ''): string => {
    if (!str) {
        return '';
    }
    colorCode = String(colorCode);

    str = str.replace(/\?/, colorCode);
    colorCode.split('').map(code => {
        str = str.replace(/\*/, code);
    });
    return str.replace(/\*/g, '');
};

export function productImagePath(filename: string, size: ProductImageSize = 250) {
    return `/images/products/${size}/${encodeURIComponent(filename)}`;
}
