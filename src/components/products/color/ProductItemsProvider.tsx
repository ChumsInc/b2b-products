import {type ReactNode, startTransition, useCallback, useEffect, useMemo, useState} from "react";
import ProductItemsContext from "@/components/products/color/ProductItemsContext.tsx";
import {useAppSelector} from "@/app/configureStore.ts";
import {selectCurrentProductId} from "@/ducks/products/productSlice.ts";
import type {ProductColorItem} from "chums-types/b2b";
import {LocalStore} from "chums-ui-utils";
import EditorProvider from "@/hooks/editor/EditorProvider.tsx";
import {localStorageKeys} from "@/api/preferences.ts";
import {newItem} from "@/components/products/color/utils.ts";


export interface ProductColorsProviderProps {
    children: ReactNode;
}

export default function ProductItemsProvider({children}: ProductColorsProviderProps) {
    const productId = useAppSelector(selectCurrentProductId);
    const [currentItem, setCurrentItem] = useState<ProductColorItem>(newItem(productId));
    const [grid, setGrid] = useState(LocalStore.getItem<boolean>(localStorageKeys.items.showImages, true));

    const setShowGrid = useCallback((checked: boolean) => {
        setGrid(checked);
        LocalStore.setItem(localStorageKeys.items.showImages, checked);
    }, [setGrid]);

    useEffect(() => {
        startTransition(() => {
            setCurrentItem(newItem(productId));
        })
    }, [productId])

    const contextValue = useMemo(() => ({
        currentItem,
        setCurrentItem,
        showGrid: grid,
        setShowGrid,
    }), [currentItem, setCurrentItem, grid, setShowGrid]);

    return (
        <ProductItemsContext value={contextValue}>
            <EditorProvider initialValue={currentItem}>
                {children}
            </EditorProvider>
        </ProductItemsContext>
    )
}
