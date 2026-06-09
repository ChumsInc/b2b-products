import type {ProductAlternateImage} from "chums-types/b2b";
import {createContext} from "react";

export interface ProductImagesContextData {
    currentImage: ProductAlternateImage;
    setCurrentImage: (image: ProductAlternateImage) => void;
    showGrid: boolean;
    setShowGrid: (show: boolean) => void;
}

const ProductImagesContext = createContext<ProductImagesContextData|null>(null);
export default ProductImagesContext;
