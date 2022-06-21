import {ThunkAction} from "redux-thunk";
import {
    deleteCurrentColorItem,
    deleteCurrentColorItemPending,
    deleteCurrentColorItemRejected,
    deleteCurrentColorItemResolved,
    deleteCurrentVariant,
    deleteCurrentVariantPending,
    deleteCurrentVariantRejected,
    deleteCurrentVariantResolved,
    duplicateProduct,
    filterActiveProducts,
    filterAvailableProducts,
    filterSaleProducts,
    loadProduct,
    loadProductPending,
    loadProductRejected,
    loadProductResolved,
    loadProducts,
    loadProductsPending,
    loadProductsRejected,
    loadProductsResolved,
    ProductsAction,
    saveCurrentColorItem,
    saveCurrentColorItemPending,
    saveCurrentColorItemRejected,
    saveCurrentColorItemResolved,
    saveCurrentVariant,
    saveCurrentVariantPending,
    saveCurrentVariantRejected,
    saveCurrentVariantResolved,
    saveMix,
    saveMixComponent,
    saveMixComponentPending,
    saveMixComponentRejected,
    saveMixComponentResolved,
    saveMixPending,
    saveMixRejected,
    saveMixResolved,
    saveProduct,
    saveProductPending,
    saveProductRejected,
    saveProductResolved,
    saveVariantSort,
    saveVariantSortPending,
    saveVariantSortRejected,
    saveVariantSortResolved,
    searchProducts,
    setCurrentColorItem,
    setCurrentProduct,
    setCurrentVariant,
    setDefaultCurrentVariant,
    setDefaultCurrentVariantPending,
    setDefaultCurrentVariantRejected,
    setDefaultCurrentVariantResolved,
    updateCurrentColorItem,
    updateCurrentMix,
    updateCurrentMixComponent,
    updateProduct,
    updateProductAdditionalData,
    updateVariant
} from "./actionTypes";
import {RootState} from "../../app/configureStore";
import {
    deleteColorItemAPI,
    deleteVariantAPI,
    fetchProductAPI,
    fetchProductsAPI,
    postProductAPI,
    saveColorItemAPI,
    saveMixAPI,
    saveMixComponentAPI,
    saveVariantAPI,
    saveVariantSortAPI,
    setDefaultVariantAPI
} from "../../api/productsAPI";
import {
    Product,
    ProductAdditionalData,
    ProductColorItem,
    ProductMixComponent,
    ProductMixItem,
    ProductVariant
} from "b2b-types/src/products";
import {
    selectCurrentColorItem,
    selectCurrentColorItemLoading,
    selectCurrentColorItemSaving,
    selectCurrentMix,
    selectCurrentMixLoading,
    selectCurrentMixSaving,
    selectCurrentProduct,
    selectCurrentProductLoading,
    selectCurrentProductSaving,
    selectCurrentVariant,
    selectCurrentVariantLoading,
    selectCurrentVariantSaving
} from "./selectors";
import {selectColorByCode} from "../colors/selectors";


interface ProductsThunkAction extends ThunkAction<any, RootState, unknown, ProductsAction> {
}

export const setProductsSearchAction = (value: string): ProductsAction => ({type: searchProducts, payload: {value}});
export const setFilterActiveAction = (checked: boolean): ProductsAction => ({
    type: filterActiveProducts,
    payload: {checked}
});
export const setFilterOnSaleAction = (checked: boolean): ProductsAction => ({
    type: filterSaleProducts,
    payload: {checked}
});
export const setFilterAvailableAction = (checked: boolean): ProductsAction => ({
    type: filterAvailableProducts,
    payload: {checked}
});

export const setNewCurrentProductAction = (): ProductsAction => ({type: setCurrentProduct});
export const loadProductListAction = (): ProductsThunkAction =>
    async (dispatch, getState) => {
        try {
            dispatch({type: loadProductsPending});
            const list = await fetchProductsAPI();
            dispatch({type: loadProductsResolved, payload: {list, clearContext: loadProducts}});
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("loadProductsListAction()", error.message);
                return dispatch({type: loadProductsRejected, payload: {error, context: loadProducts}})
            }
            console.error("loadProductsListAction()", error);
        }
    }

export const loadProductAction = (keyword: string): ProductsThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            if (selectCurrentProductLoading(state)) {
                return;
            }
            dispatch({type: loadProductPending});
            const product = await fetchProductAPI(keyword);
            dispatch({type: loadProductResolved, payload: {product, clearContext: loadProduct}});
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("loadProduct()", error.message);
                return dispatch({type: loadProductRejected, payload: {error, context: loadProduct}})
            }
            console.error("loadProduct()", error);
        }
    }

export const duplicateProductAction = () => ({type: duplicateProduct});
export const updateProductAction = (props: Partial<Product>) => ({type: updateProduct, payload: {props}});
export const updateProductAdditionalDataAction = (props: Partial<ProductAdditionalData>) => ({
    type: updateProductAdditionalData,
    payload: {props}
});

export const saveProductAction = (): ProductsThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            const loading = selectCurrentProductLoading(state);
            const saving = selectCurrentProductSaving(state);
            const _product = selectCurrentProduct(state);
            if (loading || saving || !_product.keyword) {
                return;
            }
            dispatch({type: saveProductPending})
            const product = await postProductAPI(_product);
            dispatch({type: saveProductResolved, payload: {product, clearContext: saveProduct}});
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("saveProductAction()", error.message);
                return dispatch({type: saveProductRejected, payload: {error, context: saveProduct}})
            }
            console.error("saveProductAction()", error);
        }
    }


export const setCurrentVariantAction = (variant: ProductVariant): ProductsAction => ({
    type: setCurrentVariant,
    payload: {variant: variant}
});
export const updateVariantAction = (variantProps: Partial<ProductVariant>) => ({
    type: updateVariant,
    payload: {variantProps}
});

export const saveCurrentVariantAction = (): ProductsThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            const _variant = selectCurrentVariant(state);
            const loading = selectCurrentProductLoading(state);
            const saving = selectCurrentVariantSaving(state);
            if (loading || saving || !_variant.parentProductID) {
                return;
            }

            dispatch({type: saveCurrentVariantPending})
            const variant = await saveVariantAPI(_variant);
            dispatch({type: saveCurrentVariantResolved, payload: {variant, clearContext: saveCurrentVariant}})
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("saveCurrentVariant()", error.message);
                return dispatch({type: saveCurrentVariantRejected, payload: {error, context: saveCurrentVariant}})
            }
            console.error("saveCurrentVariant()", error);
        }
    }

export const deleteVariantAction = (): ProductsThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            const variant = selectCurrentVariant(state);
            const variantLoading = selectCurrentVariantLoading(state);
            const variantSaving = selectCurrentVariantSaving(state);
            if (variantLoading || variantSaving || !variant.id || !variant.parentProductID) {
                return;
            }
            dispatch({type: deleteCurrentVariantPending})
            const variants = await deleteVariantAPI(variant);
            dispatch({type: deleteCurrentVariantResolved, payload: {variants, clearContext: deleteCurrentVariant}})
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("deleteVariantAction()", error.message);
                return dispatch({type: deleteCurrentVariantRejected, payload: {error, context: deleteCurrentVariant}})
            }
            console.error("deleteVariantAction()", error);
        }
    }

export const setDefaultVariantAction = (): ProductsThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            const variant = selectCurrentVariant(state);
            const variantLoading = selectCurrentVariantLoading(state);
            const variantSaving = selectCurrentVariantSaving(state);
            if (variantLoading || variantSaving || !variant.id || !variant.parentProductID) {
                return;
            }
            dispatch({type: setDefaultCurrentVariantPending})
            const variants = await setDefaultVariantAPI(variant);
            dispatch({
                type: setDefaultCurrentVariantResolved,
                payload: {variants, clearContext: setDefaultCurrentVariant}
            })
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("deleteVariantAction()", error.message);
                return dispatch({
                    type: setDefaultCurrentVariantRejected,
                    payload: {error, context: setDefaultCurrentVariant}
                })
            }
            console.error("deleteVariantAction()", error);
        }
    }

export const saveVariantSortAction = (_variants: ProductVariant[]): ProductsThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            const productLoading = selectCurrentProductLoading(state);
            const variantLoading = selectCurrentVariantLoading(state);
            const variantSaving = selectCurrentVariantSaving(state);
            if (productLoading || variantLoading || variantSaving || !_variants.length) {
                return;
            }
            dispatch({type: saveVariantSortPending})
            const variants = await saveVariantSortAPI(_variants);
            dispatch({type: saveVariantSortResolved, payload: {variants, clearContext: saveVariantSort}})
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("deleteVariantAction()", error.message);
                return dispatch({type: saveVariantSortRejected, payload: {error, context: saveVariantSort}})
            }
            console.error("saveVariantSortAction()", error);
        }
    }

export const setCurrentColorItemAction = (colorItem?: ProductColorItem) => ({
    type: setCurrentColorItem,
    payload: {colorItem}
});

export const updateCurrentColorItemAction = (colorItemProps: Partial<ProductColorItem>) => ({
    type: updateCurrentColorItem,
    payload: {colorItemProps}
});

export const saveCurrentColorItemAction = (): ProductsThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            const item = selectCurrentColorItem(state);
            const loading = selectCurrentColorItemLoading(state);
            const saving = selectCurrentColorItemSaving(state);
            if (loading || saving || !item.productId || !item.colorCode) {
                return;
            }
            const color = selectColorByCode(item.colorCode)(state);
            if (!color) {
                return dispatch({
                    type: saveCurrentColorItemRejected,
                    payload: {error: new Error('Invalid color code.'), context: saveCurrentColorItem}
                })
            }
            dispatch({type: saveCurrentColorItemPending})
            const colorItems = await saveColorItemAPI({...item, color, colorsId: color.id, colorName: color.name});
            dispatch({type: saveCurrentColorItemResolved, payload: {colorItems, clearContext: saveCurrentColorItem}})
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("saveCurrentVariant()", error.message);
                return dispatch({type: saveCurrentColorItemRejected, payload: {error, context: saveCurrentColorItem}})
            }
            console.error("saveCurrentColorItemAction()", error);
        }
    }

export const deleteColorItemAction = (): ProductsThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            const item = selectCurrentColorItem(state);
            const loading = selectCurrentColorItemLoading(state);
            const saving = selectCurrentColorItemSaving(state);
            if (loading || saving || !item.id || !item.productId) {
                return;
            }
            dispatch({type: deleteCurrentColorItemPending})
            const items = await deleteColorItemAPI(item);
            dispatch({
                type: deleteCurrentColorItemResolved,
                payload: {colorItems: items, clearContext: deleteCurrentColorItem}
            })
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("deleteVariantAction()", error.message);
                return dispatch({
                    type: deleteCurrentColorItemRejected,
                    payload: {error, context: deleteCurrentColorItem}
                })
            }
            console.error("deleteVariantAction()", error);
        }
    }


export const updateCurrentMixAction = (props: Partial<ProductMixItem>): ProductsAction => ({
    type: updateCurrentMix,
    payload: {mixProps: props}
});

export const updateCurrentMixComponentAction = (mixComponentProps: ProductMixComponent): ProductsAction => ({
    type: updateCurrentMixComponent,
    payload: {mixComponentProps}
});

export const saveCurrentMixAction = (): ProductsThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            const loading = selectCurrentMixLoading(state);
            const saving = selectCurrentMixSaving(state);
            const _mix = selectCurrentMix(state);
            if (!_mix.productId || saving || loading) {
                return;
            }
            dispatch({type: saveMixPending})
            const mix = await saveMixAPI(_mix);
            dispatch({type: saveMixResolved, payload: {mix, clearContext: saveMix}})
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("()", error.message);
                return dispatch({type: saveMixRejected, payload: {error, context: saveMix}})
            }
            console.error("()", error);
        }
    }

export const saveMixComponentAction = (component: ProductMixComponent): ProductsThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            const loading = selectCurrentMixLoading(state);
            const saving = selectCurrentMixSaving(state);
            const _mix = selectCurrentMix(state);
            if (!_mix.productId || saving || loading || !component.color_code || (!component.id && component.itemQuantity === 0)) {
                return;
            }
            const color = selectColorByCode(component.color_code)(state);
            if (!color || !color.id) {
                return dispatch({
                    type: saveMixComponentRejected,
                    payload: {error: new Error('Color not found for mix component'), context: saveMixComponent}
                });
            }
            dispatch({type: saveMixComponentPending})
            const mix = await saveMixComponentAPI(_mix.productId, {...component, colorsId: color.id});
            dispatch({type: saveMixComponentResolved, payload: {mix, clearContext: saveMixComponent}})
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("saveMixComponentAction()", error.message);
                return dispatch({type: saveMixComponentRejected, payload: {error, context: saveMixComponent}})
            }
            console.error("saveMixComponentAction()", error);
        }
    }
