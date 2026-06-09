import ProductImageList from "./image-list/ProductImageList.tsx";
import ProductImageEdit from "./editor/ProductImageEdit.tsx";
import ProductImagesProvider from "@/components/products/images/ProductImagesProvider.tsx";

export default function ProductImagesTab() {
    return (
        <ProductImagesProvider>
            <ProductImageEdit/>
            <ProductImageList/>
        </ProductImagesProvider>
    )
}

