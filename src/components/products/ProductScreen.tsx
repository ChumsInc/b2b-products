import React from "react";
import ProductTable from "./list/ProductTable";
import {Outlet} from "react-router";
import {Col, Row} from "react-bootstrap";
import ProductTableFilterBar from "./list/ProductTableFilterBar";
import ProductsLoading from "./list/ProductsLoading";

const ProductScreen = () => {
    return (
        <Row className="g-3">
            <Col md={6} lg={7}>
                <h2>Product List</h2>
                <ProductTableFilterBar/>
                <ProductsLoading />
                <ProductTable/>
            </Col>
            <Col md={6} lg={5}>
                <Outlet/>
            </Col>
        </Row>
    )
}

export default ProductScreen;
