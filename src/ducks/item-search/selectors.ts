import type {RootState} from "@/app/configureStore";
import type {ItemSearchList} from "@/types/item-search";

export const selectItemSearchList = (state: RootState): ItemSearchList => state.itemSearch.list;
export const selectItemSearchLoading = (state: RootState): boolean => state.itemSearch.loading;
