import {apiActionHelper} from "../utils";
import {ActionInterface, ActionPayload} from "chums-connected-components";
import {
    Product,
    ProductColorItem,
    ProductListItem,
    ProductMixComponent,
    ProductMixItem,
    ProductVariant
} from 'b2b-types/src/products';

export interface ProductFilter {
    isActive: boolean,
    isAvailableForSale: boolean,
    hasSalePrice: boolean,
}

export interface ProductsPayload extends ActionPayload {
    list?: ProductListItem[],
    product?: Product,
    variants?: ProductVariant[],
    variant?: ProductVariant,
    props?: Partial<Product>,
    variantProps?: Partial<ProductVariant>,
    colorItems?: ProductColorItem[],
    colorItem?: ProductColorItem,
    colorItemProps?: Partial<ProductColorItem>,
    mix?: ProductMixItem,
    mixProps?: Partial<ProductMixItem>,
    mixComponentProps?: ProductMixComponent
    value?: string,
    checked?: boolean,
}

export interface ProductsAction extends ActionInterface {
    payload?: ProductsPayload,
}

export const loadProducts = 'products/loadList';
export const [loadProductsPending, loadProductsResolved, loadProductsRejected] = apiActionHelper(loadProducts);

export const searchProducts = 'products/search';
export const filterActiveProducts = 'products/filterActive';
export const filterAvailableProducts = 'products/filterAvailable';
export const filterSaleProducts = 'products/filterOnSale';

export const loadProduct = 'product/currentProduct/load';
export const [loadProductPending, loadProductResolved, loadProductRejected] = apiActionHelper(loadProduct);

export const saveProduct = 'product/currentProduct/save';
export const [saveProductPending, saveProductResolved, saveProductRejected] = apiActionHelper(saveProduct);

export const updateProduct = 'product/currentProduct/update';
export const updateProductAdditionalData = 'product/currentProduct/update/additionalData';
export const setCurrentProduct = 'product/currentProduct/setProduct';
export const duplicateProduct = 'product/currentProduct/duplicate';

export const setCurrentVariant = 'product/currentVariant/setVariant';
export const updateVariant = 'product/currentVariant/update'

export const saveCurrentVariant = 'product/currentVariant/save';
export const [saveCurrentVariantPending, saveCurrentVariantResolved, saveCurrentVariantRejected] = apiActionHelper(saveCurrentVariant);

export const deleteCurrentVariant = 'product/currentVariant/delete';
export const [deleteCurrentVariantPending, deleteCurrentVariantResolved, deleteCurrentVariantRejected] = apiActionHelper(deleteCurrentVariant);

export const setDefaultCurrentVariant = 'product/currentVariant/setDefault';
export const [setDefaultCurrentVariantPending, setDefaultCurrentVariantResolved, setDefaultCurrentVariantRejected] = apiActionHelper(setDefaultCurrentVariant);

export const saveVariantSort = 'product/currentProduct/saveVariantSort';
export const [saveVariantSortPending, saveVariantSortResolved, saveVariantSortRejected] = apiActionHelper(saveVariantSort);

export const setCurrentColorItem = 'product/currentColor/setItem';
export const updateCurrentColorItem = 'product/currentColor/updateItem';

export const saveCurrentColorItem = 'product/currentColor/save';
export const [saveCurrentColorItemPending, saveCurrentColorItemResolved, saveCurrentColorItemRejected] = apiActionHelper(saveCurrentColorItem);

export const deleteCurrentColorItem = 'product/currentColor/delete';
export const [deleteCurrentColorItemPending, deleteCurrentColorItemResolved, deleteCurrentColorItemRejected] = apiActionHelper(saveCurrentColorItem);

export const updateCurrentMix = 'product/currentMix/update';
export const updateCurrentMixComponent = 'product/currentMix/updateComponent';

export const saveMix = 'product/currentMix/save';
export const [saveMixPending, saveMixResolved, saveMixRejected] = apiActionHelper(saveMix);

export const saveMixComponent = 'product/currentMix/saveComponent';
export const [saveMixComponentPending, saveMixComponentResolved, saveMixComponentRejected] = apiActionHelper(saveMixComponent);


