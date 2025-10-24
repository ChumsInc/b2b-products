import type {SortProps} from "chums-types";
import type {ProductColorItem} from "b2b-types";

export const productColorSorter = (sort:SortProps<ProductColorItem>) => (a:ProductColorItem, b:ProductColorItem) => {
    const {field, ascending} = sort;
    const sortMod = ascending ? 1 : -1;
    switch (field) {
        case 'colorCode':
        case 'itemCode':
            return ((a[field] ?? '').toLowerCase() === (b[field] ?? '').toLowerCase()
                ? a.id - b.id
                : ((a[field] ?? '').toLowerCase().localeCompare((b[field] ?? '').toLowerCase()))
            ) * sortMod;
        case 'additionalData':
            return ((a.additionalData?.image_filename ?? '').toLowerCase() === (b.additionalData?.image_filename ?? '').toLowerCase()
                    ? a.id - b.id
                    : ((a.additionalData?.image_filename ?? '').toLowerCase().localeCompare((b.additionalData?.image_filename ?? '').toLowerCase()))
            ) * sortMod;
        case 'season':
            return ((a.season?.code ?? '').toLowerCase() === (b.season?.code ?? '').toLowerCase()
                ? a.id - b.id
                : ((a.season?.code ?? '').toLowerCase().localeCompare((b.season?.code ?? '').toLowerCase()))
            ) * sortMod;
        case 'status':
            return (a.status === b.status ? a.id - b.id : (+a.status - +b.status)) * sortMod;
        default:
            return (a.id - b.id) * sortMod;
    }
}
