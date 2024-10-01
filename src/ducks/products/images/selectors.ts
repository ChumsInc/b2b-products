import {RootState} from "../../../app/configureStore";

export const selectImages = (state: RootState) => state.products.current.images.list;
export const selectCurrentImage = (state:RootState) => state.products.current.images.current;
export const selectImageSaving = (state:RootState) => state.products.current.images.status === 'saving';
export const selectImagesStatus = (state:RootState) => state.products.current.images.status;
