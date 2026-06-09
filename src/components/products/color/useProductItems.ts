import {useContext} from "react";
import ProductItemsContext from "@/components/products/color/ProductItemsContext.tsx";

export default function useProductItems() {
    const context = useContext(ProductItemsContext);
    if (!context) {
        throw new Error("useProductItems must be used within a ProductItemsProvider");
    }
    return context;
}
