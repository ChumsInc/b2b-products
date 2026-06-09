import React, {type ChangeEvent, useId} from 'react';
import {
    selectCurrentColorShowInactive,
    selectFilteredProductColors,
    setColorsShowInactive
} from "@/ducks/products/productColorItemsSlice.ts";
import {selectCurrentProduct} from "@/ducks/products/productSlice.ts";
import {LocalStore} from "@/api/localStore.ts";
import {useAppDispatch, useAppSelector} from "@/app/configureStore.ts";
import {Col, FormCheck, Row} from "react-bootstrap";
import {localStorageKeys} from "@/api/preferences.ts";
import ProductColorGrid from "@/components/products/color/list/ProductColorGrid.tsx";
import ProductColorTable from "@/components/products/color/list/ProductColorTable.tsx";
import useProductItems from "@/components/products/color/useProductItems.ts";
import TableResponsiveContainer from "@/components/common/TableResponsiveContainer.tsx";


const ProductColorList = () => {
    const {showGrid, setShowGrid} = useProductItems();
    const dispatch = useAppDispatch();
    const list = useAppSelector(selectFilteredProductColors);
    const product = useAppSelector(selectCurrentProduct);
    const showInactive = useAppSelector(selectCurrentColorShowInactive);
    const showInactiveId = useId();
    const showGridId = useId();

    const onChangeShowImages = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setShowGrid(ev.target.checked);
    }


    const showInactiveChangeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
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
            </Row>
            {showGrid && (
                <ProductColorGrid list={list}/>
            )}
            {!showGrid && (
                <TableResponsiveContainer style={{maxHeight: '70vh', overflow: 'auto'}}>
                    <ProductColorTable list={list}/>
                </TableResponsiveContainer>
            )}
        </>
    )
}
export default ProductColorList;
