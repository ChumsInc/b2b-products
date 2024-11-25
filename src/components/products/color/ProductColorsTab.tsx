import React from 'react';
import ProductColorEditor from "./ProductColorEditor";
import ProductColorList from "./ProductColorList";
import ProductColorImage from "./ProductColorImage";
import {Col, Row} from "react-bootstrap";

const ProductColorsTab:React.FC = () => {

    return (
        <div>
            <Row className="g-3">
                <Col  lg={12} xl={6}>
                    <ProductColorEditor />
                </Col>
                <Col xl={6} className="d-lg-none d-xl-block">
                    <ProductColorImage />
                </Col>
            </Row>
            <ProductColorList />
        </div>
    )
}

export default ProductColorsTab;
