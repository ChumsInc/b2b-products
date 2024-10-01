import {RootState} from "../../app/configureStore";

export const selectKeywordsList = (state: RootState) => state.keywords.list;
export const selectKeywordsLoading = (state: RootState) => state.keywords.loading;
export const selectKeywordsLoaded = (state: RootState) => state.keywords.loaded;
