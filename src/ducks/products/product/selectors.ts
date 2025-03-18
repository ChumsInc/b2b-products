import {RootState} from "@/app/configureStore";
import {ProductSellAs} from "b2b-types";

export const selectCurrentProduct = (state: RootState) => state.products.current.product.value;
export const selectCurrentProductId = (state: RootState): number => state.products.current.product.value?.id ?? 0;
export const selectCurrentProductKeyword = (state: RootState): string => state.products.current.product.value?.keyword ?? '';
export const selectCurrentProductStatus = (state: RootState) => state.products.current.product.value?.status ?? false;
export const selectCurrentProductSellAs = (state: RootState): ProductSellAs | null => state.products.current.product.value?.sellAs ?? null;
export const selectCurrentProductChanged = (state: RootState): boolean => state.products.current.product.value?.changed ?? false;
export const selectCurrentProductLoading = (state: RootState) => state.products.current.product.loading;
export const selectCurrentProductSaving = (state: RootState) => state.products.current.product.saving;
export const selectTabs = (state: RootState) => state.products.current;
