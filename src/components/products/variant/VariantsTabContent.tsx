import SortableVariantList from "./SortableVariantList";
import ProductVariantEditContainer from "@/components/products/variant/editor/ProductVariantEditContainer.tsx";

const VariantsTabContent = () => {

    return (
        <div>
            <ProductVariantEditContainer/>
            {/*<ProductVariantsEditor />*/}
            <SortableVariantList/>
        </div>
    )
}

export default VariantsTabContent;
