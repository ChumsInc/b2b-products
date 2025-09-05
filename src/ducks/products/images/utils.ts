import {SortProps} from "chums-types";
import {ProductAlternateImage} from "b2b-types";

export const altImageSort = (sort:SortProps<ProductAlternateImage>) => (a:ProductAlternateImage, b:ProductAlternateImage) => {
    const sortMod = sort.ascending ? 1 : -1;
    switch (sort.field) {
        case 'altText':
        case 'image':
            return (a[sort.field].toLowerCase() === b[sort.field].toLowerCase()
                ? (a.priority === b.priority ? a.id - b.id : a.priority - b.priority)
                : (a[sort.field].toLowerCase() > b[sort.field].toLowerCase() ? 1 : -1)) * sortMod;
        case 'priority':
            return (a.priority === b.priority ? a.id - b.id : (a.priority - b.priority)) * sortMod;
        default:
            return (a.id - b.id) * sortMod;
    }
}

export const defaultAltImageSort:SortProps<ProductAlternateImage> = {field: 'altText', ascending: true};

export interface ImageFilterProps {
    search?: string;
    itemCode?: string;
}

export const imageFilter = (list: ProductAlternateImage[], options: ImageFilterProps) => {
    return list.filter(i => !options.itemCode || i.altText.includes(`#${options.itemCode}`))
        .filter(i => !options.search
            || i.altText.toLowerCase().includes(options.search.toLowerCase())
            || i.image.toLowerCase().includes(options.search.toLowerCase()))
}

export const productAltImageSrc = (img: ProductAlternateImage, size?: string|number) => {
    return `/images/products/${size ?? 80}/${img.image}`
}
