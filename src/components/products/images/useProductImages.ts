import {useContext} from "react";
import ProductImagesContext from "@/components/products/images/ProductImagesContext.tsx";

export function useProductImages() {
    const context = useContext(ProductImagesContext);
    if (!context) {
        throw new Error("useProductImages must be used within a ProductImagesProvider");
    }
    return context;
}
