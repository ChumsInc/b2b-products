import React, {ChangeEvent, useEffect, useId, useState} from 'react';
import {useSelector} from "react-redux";
import {
    selectCurrentColorItem, selectCurrentColorShowInactive,
    selectCurrentProductColors,
    selectFilteredProductColors
} from "../../../ducks/products/color/selectors";
import {selectCurrentProduct} from "../../../ducks/products/product/selectors";
import ProductImage from "../../app/ProductImage";
import {ProductColorItem} from "b2b-types/src/products";
import {TablePagination} from "@chumsinc/sortable-tables";
import classNames from "classnames";
import {LocalStore, storeProductItemsRowsPerPage} from "../../../localStore";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {setColorsShowInactive, setCurrentColorItem} from "../../../ducks/products/color/actions";
import SeasonIcon from "../../season/SeasonIcon";
import {Badge, Card, Col, FormCheck, Row} from "react-bootstrap";
import {localStorageKeys} from "../../../api/preferences";
import ColorSwatch from "../../colors/ColorSwatch";
import numeral from "numeral";
import ProductColorGrid from "@/components/products/color/ProductColorGrid";
import ProductColorTable from "@/components/products/color/ProductColorTable";


const ProductColorList = () => {
    const dispatch = useAppDispatch();
    const list = useSelector(selectFilteredProductColors);
    const product = useSelector(selectCurrentProduct);
    const showInactiveId = useId();
    const showInactive = useAppSelector(selectCurrentColorShowInactive);
    const showGridId = useId();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [showGrid, setShowGrid] = useState(LocalStore.getItem<boolean>(localStorageKeys.items.showImages, true));

    useEffect(() => {
        const rowsPerPage = LocalStore.getItem<number>(storeProductItemsRowsPerPage, 25) ?? 25;
        setRowsPerPage(rowsPerPage);
    }, [])

    useEffect(() => {
        setPage(0);
    }, [list, rowsPerPage]);

    const onChangeShowImages = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setShowGrid(ev.target.checked);
        LocalStore.setItem<boolean>(localStorageKeys.items.showImages, ev.target.checked);
    }
    const onChangeRowsPerPage = (value: number) => {
        LocalStore.setItem(storeProductItemsRowsPerPage, value);
        setRowsPerPage(value);
    }

    const selectItemHandler = (item: ProductColorItem) => dispatch(setCurrentColorItem(item));

    const showInactiveChangeHandler = (ev:ChangeEvent<HTMLInputElement>) => {
        LocalStore.setItem<boolean>(localStorageKeys.productColors.showInactive, ev.target.checked);
        dispatch(setColorsShowInactive(ev.target.checked));
    }

    if (!product) {
        return null;
    }
    return (
        <>
            <hr/>
            <Row className="g-3 align-items-baseline mb-3">
                <Col xs="auto">
                    <FormCheck label="Show Inactive" id={showInactiveId} checked={showInactive}
                               onChange={showInactiveChangeHandler} type="checkbox"/>
                </Col>
                <Col xs="auto">
                    <FormCheck label="Show Image Grid" id={showGridId} checked={showGrid}
                               onChange={onChangeShowImages} type="checkbox"/>
                </Col>
                <Col>
                    <TablePagination size="sm"
                                     page={page} onChangePage={setPage}
                                     rowsPerPage={rowsPerPage}
                                     rowsPerPageProps={{onChange: onChangeRowsPerPage, label: 'Images'}}
                                     count={list.length}/>
                </Col>
            </Row>
            {showGrid && (
                <ProductColorGrid list={list} onSelectItem={selectItemHandler} />
            )}
            {!showGrid && (
                <ProductColorTable list={list} onSelectItem={selectItemHandler} />
            )}
        </>
    )
}
export default ProductColorList;
