import {type ReactNode, startTransition, useCallback, useEffect, useMemo, useState} from "react";
import ProductImagesContext, {
    type ProductImagesContextData
} from "@/components/products/images/ProductImagesContext.tsx";
import type {ProductAlternateImage} from "chums-types/b2b";
import {LocalStore} from "chums-ui-utils";
import EditorProvider from "@/hooks/editor/EditorProvider.tsx";
import {useAppSelector} from "@/app/configureStore.ts";
import {selectCurrentProductId} from "@/ducks/products/productSlice.ts";

const showGridKey = 'b2b-products/productImagesGrid';

const emptyImage: ProductAlternateImage = {
    id: 0,
    image: '',
    status: true,
    altText: '',
    priority: 0,
    productId: 0,
}

const newImage = (productId: number) => ({...emptyImage, productId});

export interface ProductImagesProviderProps {
    children: ReactNode;
}

export default function ProductImagesProvider({children}: ProductImagesProviderProps) {
    const productId = useAppSelector(selectCurrentProductId);
    const [currentImage, setCurrentImage] = useState<ProductAlternateImage>(newImage(productId));
    const [grid, setGrid] = useState(LocalStore.getItem<boolean>(showGridKey, true));

    const setShowGrid = useCallback((checked: boolean) => {
        setGrid(checked);
        LocalStore.setItem(showGridKey, checked);
    }, [setGrid]);

    useEffect(() => {
        startTransition(() => {
            setCurrentImage(newImage(productId));
        });
    }, [productId]);

    const contextValue = useMemo<ProductImagesContextData>(() => ({
        currentImage,
        setCurrentImage,
        showGrid: grid,
        setShowGrid
    }), [currentImage, setCurrentImage, grid, setShowGrid]);

    return (
        <ProductImagesContext value={contextValue}>
            <EditorProvider initialValue={currentImage}>
                {children}
            </EditorProvider>
        </ProductImagesContext>
    )

}
