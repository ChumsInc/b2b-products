import React, {useId, useState} from "react";
import {Col, FormCheck, FormControl, Row} from "react-bootstrap";
import ProductImageGrid from "@/components/products/images/ProductImageGrid";
import ProductImageTable from "@/components/products/images/ProductImageTable";
import {LocalStore} from "chums-ui-utils";
import InputGroup from "react-bootstrap/InputGroup";
import {useAppDispatch, useAppSelector} from "@/components/app/hooks";
import {setShowInactiveImages} from "@/ducks/products/images/actions";
import {selectShowInactiveImages} from "@/ducks/products/images/selectors";

const showGridKey = 'b2b-products/productImagesGrid';

const ProductImageList = () => {
    const dispatch = useAppDispatch();
    const showInactive = useAppSelector(selectShowInactiveImages);
    const [grid, setGrid] = useState(LocalStore.getItem<boolean>(showGridKey, true));
    const [search, setSearch] = useState<string>('');
    const [itemCode, setItemCode] = useState<string>('');
    const showGridId = useId();
    const searchId = useId();
    const itemCodeId = useId();
    const showInactiveId = useId();

    const changeHandler = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setGrid(ev.target.checked);
        LocalStore.setItem(showGridKey, ev.target.checked);
    }

    const onChangeShowImages = (ev: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setShowInactiveImages(ev.target.checked));
    }

    return (
        <div className="mt-3">
            <Row className="g-3 mb-1">
                <Col>
                    <h4>Images</h4>
                </Col>
                <Col xs="auto">
                    <FormCheck type="checkbox" label="Show Inactive" id={showInactiveId} checked={showInactive}
                               onChange={onChangeShowImages}/>
                </Col>
                <Col xs="auto">
                    <InputGroup size="sm">
                        <InputGroup.Text as="label" htmlFor={searchId} aria-label="Search Images">
                            <span className="bi-search" aria-hidden="true"/>
                        </InputGroup.Text>
                        <FormControl type="search" placeholder="Search" id={searchId}
                                     value={search} onChange={ev => setSearch(ev.target.value)}
                                     aria-label="Search"/>
                    </InputGroup>
                </Col>
                <Col xs="auto">
                    <InputGroup size="sm">
                        <InputGroup.Text as="label" htmlFor={itemCodeId} aria-label="Filter by Item Code">
                            <span className="bi-key-fill" aria-hidden="true"/>
                        </InputGroup.Text>
                        <FormControl type="search" placeholder="Item Code" id={itemCodeId}
                                     value={itemCode} onChange={ev => setItemCode(ev.target.value)}
                                     aria-label="Search"/>
                    </InputGroup>
                </Col>
                <Col xs="auto">
                    <FormCheck type="switch" id={showGridId} label="Display Grid" checked={grid}
                               onChange={changeHandler}/>
                </Col>
            </Row>
            {grid && (
                <ProductImageGrid search={search} itemCode={itemCode}/>
            )}
            {!grid && (
                <ProductImageTable search={search} itemCode={itemCode}/>
            )}

        </div>
    )
}

export default ProductImageList;
