import type {Editable, Product} from "chums-types/b2b";

export type EditableProduct = Product & Editable;
export interface CurrentProductState {
    value: EditableProduct | null,
    status: 'idle'|'loading'|'saving'|'rejected';
    loading: boolean;
    saving: boolean;
}
