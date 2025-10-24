import {type RootState} from "@/app/configureStore";

export const selectWhereUsedProducts = (state:RootState) => state.whereUsed.products;
export const selectWhereUsedCategories = (state:RootState) => state.whereUsed.categories;
export const selectWhereUsedSearch = (state:RootState) => state.whereUsed.search;
export const selectWhereUsedLoading = (state:RootState) => state.whereUsed.loading;
