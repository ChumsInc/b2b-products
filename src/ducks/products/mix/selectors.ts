import {RootState} from "../../../app/configureStore";

export const selectCurrentMix = (state: RootState) => state.products.current.mix.mix;
export const selectCurrentMixComponents = (state: RootState) => state.products.current.mix.mix?.items ?? [];
export const selectCurrentMixStatus = (state: RootState) => state.products.current.mix.status;
export const selectCurrentMixBOMStatus = (state: RootState) => state.products.current.mix.bom.status;
export const selectCurrentMixBOMHeader = (state:RootState) => state.products.current.mix.bom.header;
export const selectCurrentMixBOMDetail = (state:RootState) => state.products.current.mix.bom.detail;


