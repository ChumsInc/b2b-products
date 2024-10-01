import {RootState} from "../../../app/configureStore";

export const selectCurrentKeyword = (state: RootState) => state.products.current.keyword.keyword;
