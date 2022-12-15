import {RootState} from "../../../app/configureStore";

export const selectCurrentProductColors = (state: RootState) => state.products.current.color.list || [];

export const selectCurrentColorItem = (state: RootState) => state.products.current.color.colorItem;

export const selectCurrentColorItemLoading = (state: RootState): boolean => state.products.current.color.loading;

export const selectCurrentColorItemSaving = (state: RootState): boolean => state.products.current.color.saving;

export const selectCurrentColorStatus = (state:RootState) => state.products.current.color.status;
