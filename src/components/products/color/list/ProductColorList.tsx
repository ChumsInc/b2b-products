import React, {type ChangeEvent, useId, useState} from 'react';
import {
    selectCurrentColorShowInactive,
    selectFilteredProductColors, selectShowDiscontinuedColors, setColorsShowDiscontinued,
    setColorsShowInactive
} from "@/ducks/products/productColorItemsSlice.ts";
import {selectCurrentProduct} from "@/ducks/products/productSlice.ts";
import {LocalStore} from "@/api/localStore.ts";
import {useAppDispatch, useAppSelector} from "@/app/configureStore.ts";
import {Col, FormCheck, FormControl, InputGroup, Row} from "react-bootstrap";
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
    const showDiscontinued = useAppSelector(selectShowDiscontinuedColors);
    const showInactiveId = useId();
    const showDiscontinuedId = useId();
    const showGridId = useId();
    const [filter, setFilter] = useState<string>('');

    const onChangeShowImages = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setShowGrid(ev.target.checked);
    }


    const showInactiveChangeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        LocalStore.setItem<boolean>(localStorageKeys.productColors.showInactive, ev.target.checked);
        dispatch(setColorsShowInactive(ev.target.checked));
    }

    const showDiscontinuedChangeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        LocalStore.setItem<boolean>(localStorageKeys.productColors.showDiscontinued, ev.target.checked);
        dispatch(setColorsShowDiscontinued(ev.target.checked));
    }

    const filteredList = list
        .filter(item => !filter
            || item.colorName.toLowerCase().includes(filter.toLowerCase())
            || item.colorCode.toLowerCase().includes(filter.toLowerCase())
            || item.itemCode.toLowerCase().includes(filter.toLowerCase())
            || item.additionalData?.image_filename?.toLowerCase().includes(filter.toLowerCase())
        );

    if (!product) {
        return null;
    }

    return (
        <>
            <hr/>
            <Row className="g-3 align-items-baseline mb-3">
                <Col>
                    <InputGroup size="sm">
                        <InputGroup.Text>
                            <i className="bi-search" aria-label="Filter Items"/>
                        </InputGroup.Text>
                        <FormControl size="sm" placeholder="Filter" value={filter} onChange={(ev) => setFilter(ev.target.value)}/>
                    </InputGroup>
                </Col>
                <Col xs="auto">
                    <FormCheck label="Show Inactive" id={showInactiveId} checked={showInactive}
                               onChange={showInactiveChangeHandler} type="checkbox"/>
                </Col>
                <Col xs="auto">
                    <FormCheck label="Show Discontinued" id={showDiscontinuedId} checked={showDiscontinued}
                               onChange={showDiscontinuedChangeHandler} type="checkbox"/>
                </Col>
                <Col xs="auto">
                    <FormCheck label="Show Image Grid" id={showGridId} checked={showGrid}
                               onChange={onChangeShowImages} type="checkbox"/>
                </Col>
            </Row>
            {showGrid && (
                <ProductColorGrid list={filteredList}/>
            )}
            {!showGrid && (
                <TableResponsiveContainer style={{maxHeight: '70vh', overflow: 'auto'}}>
                    <ProductColorTable list={filteredList}/>
                </TableResponsiveContainer>
            )}
        </>
    )
}
export default ProductColorList;
