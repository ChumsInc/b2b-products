import {RootState} from "../../app/configureStore";

export const selectSeasons = (state: RootState) => state.seasons.list;
export const selectSeasonsLoading = (state: RootState) => state.seasons.loading;
