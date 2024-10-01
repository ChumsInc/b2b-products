import {SortProps} from "chums-components";
import {ProductAlternateImage} from "b2b-types/src/products";

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
            return a.id - b.id;
    }
}

export const defaultAltImageSort:SortProps<ProductAlternateImage> = {field: 'altText', ascending: true};

