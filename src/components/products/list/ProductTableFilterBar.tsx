import React from 'react';
import {loadProductsList} from "@/ducks/productList/actions";
import {useAppDispatch} from "../../app/hooks";
import {loadKeywords} from "../../../ducks/keywords/actions";
import {loadColors} from "../../../ducks/colors/actions";
import {loadSeasons} from "../../../ducks/seasons/actions";
import {reloadSwatchCSSFile} from "../../../utils";
import {Button, Col, Row} from "react-bootstrap";
import FilterActiveProducts from "./FilterActiveProducts";
import FilterOnSaleProducts from "./FilterOnSaleProducts";
import FilterAvailableProducts from "./FilterAvailableProducts";
import FilterSeasonProducts from "./FilterSeasonProducts";
import FilterCategoryProducts from "./FilterCategoryProducts";
import FilterSearchProducts from "./FilterSearchProducts";

export default function ProductTableFilterBar() {
    const dispatch = useAppDispatch();

    const reloadHandler = () => {
        dispatch(loadProductsList());
        dispatch(loadKeywords())
        dispatch(loadColors());
        dispatch(loadSeasons());
        reloadSwatchCSSFile();
    }

    return (
        <Row className="row g-3 mb-1 align-items-baseline">
            <Col style={{minWidth: '15rem'}}>
                <FilterSearchProducts/>
            </Col>
            <Col xs="auto">
                <FilterActiveProducts/>
            </Col>
            <Col xs="auto">
                <FilterOnSaleProducts/>
            </Col>
            <Col xs="auto">
                <FilterAvailableProducts/>
            </Col>
            <Col xs="auto">
                <FilterSeasonProducts/>
            </Col>
            <Col xs="auto">
                <FilterCategoryProducts/>
            </Col>
            <Col xs="auto">
                <Button type="button" onClick={reloadHandler} size="sm">Reload</Button>
            </Col>
        </Row>
    )
}
