import {RootState} from "../../../app/configureStore";

export const selectCurrentMix = (state: RootState) => state.products.current.mix.mix;
export const selectCurrentMixComponents = (state: RootState) => state.products.current.mix.mix?.items ?? [];
export const selectCurrentMixLoading = (state: RootState) => state.products.current.mix.loading;
export const selectCurrentMixSaving = (state: RootState) => state.products.current.mix.saving;
