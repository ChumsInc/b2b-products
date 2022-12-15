import {RootState} from "../../../app/configureStore";

export const selectCurrentMix = (state: RootState) => state.products.current.mix.mix;
export const selectCurrentMixComponents = (state: RootState) => state.products.current.mix.mix?.items ?? [];
export const selectCurrentMixStatus = (state: RootState) => state.products.current.mix.status;


