import type {ProductColorItem} from "chums-types/b2b";
import {createContext} from "react";

export interface ProductItemsContextData {
    currentItem: ProductColorItem;
    setCurrentItem: (item: ProductColorItem) => void;
    showGrid: boolean;
    setShowGrid: (show: boolean) => void;
}

const ProductItemsContext = createContext<ProductItemsContextData|null>(null);
export default ProductItemsContext;
