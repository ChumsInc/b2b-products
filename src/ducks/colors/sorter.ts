import {ColorProductUsage, ProductColor} from "b2b-types";
import {SortProps} from "chums-types";


export const colorSorter = ({field, ascending}: SortProps<ProductColor>) =>
    (a: ProductColor, b: ProductColor) => {
        const asc = ascending ? 1 : -1;
        switch (field) {
        case 'id':
        case 'active':
            return (a.id - b.id) * asc;
        default:
            const aVal = (a[field] || '').toLowerCase();
            const bVal = (b[field] || '').toLowerCase();
            return (aVal === bVal ? (a.id - b.id) : (aVal > bVal ? 1 : -1)) * asc;
        }
    }

export const colorProductUsageSorter = ({field, ascending}: SortProps<ColorProductUsage>) =>
    (a: ColorProductUsage, b: ColorProductUsage) => {
        const asc = ascending ? 1 : -1;
        switch (field) {
        case 'productId':
            return (a.productId - b.productId) * asc;
        case 'status':
            return (a.status === b.status ? (a.productId - b.productId) : (+a.status - +b.status)) * asc;
        default:
            const aVal = (a[field] || '').toLowerCase();
            const bVal = (b[field] || '').toLowerCase();
            return (aVal === bVal ? (a.productId - b.productId) : (aVal > bVal ? 1 : -1)) * asc;
        }
    }
