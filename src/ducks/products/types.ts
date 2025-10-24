import type {Editable, Product} from "b2b-types";

export type EditableProduct = Product & Editable;
export interface CurrentProductState {
    value: EditableProduct | null,
    status: 'idle'|'loading'|'saving'|'rejected';
    loading: boolean;
    saving: boolean;
}
