import {ProductListItem} from "b2b-types";
import {ProductListSorterProps} from "../../types/product";
import {ProductColorItem, ProductMixComponent, ProductVariant} from "b2b-types/src/products";
import {SortProps} from "chums-components";


export const productListSorter = ({field, ascending}: ProductListSorterProps) =>
    (a: ProductListItem, b: ProductListItem): number => {
        const ascMod = ascending ? 1 : -1;
        switch (field) {
        case 'name':
        case 'itemCode':
        case 'keyword':
            return (
                a[field].toLowerCase() === b[field].toLowerCase()
                    ? a.id - b.id
                    : (a[field].toLowerCase() > b[field].toLowerCase() ? 1 : -1)
            ) * ascMod;
        case "defaultParentProductsId":
        case 'salePrice':
            return (
                (a[field] || 0) === (b[field] || 0)
                    ? a.id - b.id
                    : ((a[field] || 0) > (b[field] || 0) ? 1 : -1)
            ) * ascMod;
        case 'season_code':
            return (
                (a[field] || '').toLowerCase() === (b[field] || '').toLowerCase()
                    ? a.id - b.id
                    : ((a[field] || '').toLowerCase() > (b[field] || '').toLowerCase() ? 1 : -1)
            ) * ascMod;
        default:
            return (a.id - b.id) * ascMod;
        }
    }


export const variantListSorter = ({field, ascending}: SortProps<ProductVariant>) =>
    (a: ProductVariant, b: ProductVariant) => {
        const ascMod = ascending ? 1 : -1;
        switch (field) {
        case 'isDefaultVariant':
            return (+a[field] === +b[field]
                ? a.id - b.id
                : (+b[field] - +a[field])) * ascMod;
        case 'title':
            return (a[field].toLowerCase() === b[field].toLowerCase()
                ? a.id - b.id
                : ((a[field].toLowerCase() > b[field].toLowerCase()) ? 1 : -1)) * ascMod;
        case 'parentProductID':
        case 'priority':
            return (a[field] === b[field]
                ? a.id - b.id
                : (a[field] - b[field])) * ascMod;
        default:
            return (a.id - b.id) * ascMod;
        }
    }

export const colorItemSorter = (a: ProductColorItem, b: ProductColorItem) => {
    return a.color.code === b.color.code
        ? (a.id - b.id)
        : (a.color.code.toLowerCase() > b.color.code.toLowerCase() ? 1 : -1)
}

export const mixComponentSorter = (a: ProductMixComponent, b: ProductMixComponent): number => {
    return a.itemCode === b.itemCode
        ? (a.id - b.id)
        : (a.itemCode > b.itemCode ? 1 : -1);
}
