import ProductColorEditor from "./editor/ProductColorEditor.tsx";
import ProductColorList from "./list/ProductColorList.tsx";
import ProductColorImage from "./editor/ProductColorImage.tsx";
import {Col, Row} from "react-bootstrap";
import ProductItemsProvider from "@/components/products/color/ProductItemsProvider.tsx";

export default function ProductColorsTab() {

    return (
        <ProductItemsProvider>
            <Row className="g-3">
                <Col>
                    <ProductColorEditor />
                </Col>
                <Col lg="auto">
                    <ProductColorImage />
                </Col>
            </Row>
            <ProductColorList />
        </ProductItemsProvider>
    )
}
