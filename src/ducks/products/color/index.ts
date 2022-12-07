import {ProductColorItem} from "b2b-types";
import {createReducer} from "@reduxjs/toolkit";
import {loadProduct} from "../product/actions";
import {removeColorItem, saveCurrentColorItem, setCurrentColorItem} from "./actions";
import {isSellAsColorsProduct} from "../utils";


export interface CurrentColorState {
    productId: number | null;
    list: ProductColorItem[];
    colorItem: ProductColorItem | null;
    loading: boolean;
    saving: boolean;
}

export const initialCurrentColorState: CurrentColorState = {
    productId: null,
    list: [],
    colorItem: null,
    loading: false,
    saving: false,
}

const currentColorReducer = createReducer(initialCurrentColorState, (builder) => {
    builder
        .addCase(loadProduct.fulfilled, (state, action) => {
            if (action.payload && isSellAsColorsProduct(action.payload)) {
                state.list = action.payload.items ?? [];
                if (state.productId === action.payload.id && !!state.colorItem?.id) {
                    const [item] = state.list.filter(item => item.id === state.colorItem?.id);
                    state.colorItem = item ?? null;
                }
            }
            state.productId = action.payload?.id ?? null;
        })
        .addCase(setCurrentColorItem, (state, action) => {
            state.colorItem = action.payload;
        })
        .addCase(saveCurrentColorItem.pending, (state) => {
            state.saving = true;
        })
        .addCase(saveCurrentColorItem.fulfilled, (state, action) => {
            state.list = action.payload ?? [];
            state.saving = false;
            const [item] = state.list.filter(item => item.id === state.colorItem?.id);
            state.colorItem = item ?? null;
        })
        .addCase(saveCurrentColorItem.rejected, (state) => {
            state.saving = false;
        })
        .addCase(removeColorItem.pending, (state) => {
            state.saving = true;
        })
        .addCase(removeColorItem.fulfilled, (state, action) => {
            state.saving = false;
            state.list = action.payload ?? [];
            state.colorItem = null;
        })
        .addCase(removeColorItem.rejected, (state) => {
            state.saving = false;
        })

})
export default currentColorReducer;
