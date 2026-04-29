import EditorProvider from "@/hooks/editor/EditorProvider.tsx";
import {useAppSelector} from "@/app/configureStore.ts";
import {selectCurrentProductId} from "@/ducks/products/productSlice.ts";
import {defaultVariant} from "../../../../utils/defaults.ts";
import {selectCurrentVariant} from "@/ducks/products/productVariantsSlice.ts";
import {Col, Row} from "react-bootstrap";
import VariantForm from "@/components/products/variant/editor/VariantForm.tsx";
import ProductImage from "@/components/products/variant/ProductImage.tsx";

export default function ProductVariantEditContainer() {
    const productId = useAppSelector(selectCurrentProductId);
    const currentVariant = useAppSelector(selectCurrentVariant);
    return (
        <EditorProvider initialValue={currentVariant ?? {...defaultVariant, parentProductId: productId}}>
            <Row className="g-3">
                <Col md={8} xs={12}>
                    <VariantForm />
                </Col>
                <Col md={4} xs={12}>
                    <ProductImage imageUrl={currentVariant?.product?.image} defaultColor={currentVariant?.product?.defaultColor}
                                  size="400"/>
                </Col>
            </Row>
        </EditorProvider>
    )
}
