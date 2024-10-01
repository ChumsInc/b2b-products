import {RootState} from "../../app/configureStore";
import {ItemSearchList} from "../../types/item-search";

export const selectItemSearchList = (state: RootState): ItemSearchList => state.itemSearch.list;
export const selectItemSearchLoading = (state: RootState): boolean => state.itemSearch.loading;
