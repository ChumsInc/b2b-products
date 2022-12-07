import {RootState} from "../../../app/configureStore";

export const selectCurrentProductVariants = (state: RootState) => state.products.current.variant.list;

export const selectCurrentVariant = (state: RootState) => state.products.current.variant.variant;
export const selectCurrentVariantSaving = (state: RootState) => state.products.current.variant.saving;
