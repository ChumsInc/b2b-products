import React, {useEffect, useId, useState} from 'react';
import {useSelector} from "react-redux";
import {selectCurrentColorItem, selectCurrentProductColors} from "../../../ducks/products/color/selectors";
import {selectCurrentProduct} from "../../../ducks/products/product/selectors";
import ProductImage from "../../app/ProductImage";
import {ProductColorItem} from "b2b-types/src/products";
import {TablePagination} from "@chumsinc/sortable-tables";
import classNames from "classnames";
import {LocalStore, storeProductItemsRowsPerPage} from "../../../localStore";
import {useAppDispatch} from "../../app/hooks";
import {setCurrentColorItem} from "../../../ducks/products/color/actions";
import SeasonIcon from "../../season/SeasonIcon";
import {Badge, Card, Col, FormCheck, Row} from "react-bootstrap";
import {localStorageKeys} from "../../../api/preferences";
import ColorSwatch from "../../colors/ColorSwatch";
import numeral from "numeral";


const ProductColorList = () => {
    const dispatch = useAppDispatch();
    const list = useSelector(selectCurrentProductColors);
    const product = useSelector(selectCurrentProduct);
    const selected = useSelector(selectCurrentColorItem);
    const showInactiveId = useId();
    const showImageId = useId();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [showInactive, setShowInactive] = useState(false);
    const [filteredList, setFilteredList] = useState<ProductColorItem[]>(list.filter(row => showInactive || row.selfStatus));
    const [showImage, setShowImage] = useState(LocalStore.getItem<boolean>(localStorageKeys.items.showImages, true));

    useEffect(() => {
        const rowsPerPage = LocalStore.getItem<number>(storeProductItemsRowsPerPage, 25) ?? 25;
        setRowsPerPage(rowsPerPage);
    }, [])

    useEffect(() => {
        const filteredList = list.filter(row => showInactive || row.selfStatus);
        setFilteredList(filteredList);
        setPage(1);
    }, [product?.id]);

    useEffect(() => {
        const filteredList = list.filter(row => showInactive || row.selfStatus);
        const nextPage = Math.floor(filteredList.length / rowsPerPage) < page ? 0 : page;
        setFilteredList(filteredList);
        setPage(nextPage);
    }, [list, showInactive, rowsPerPage]);

    const onChangeShowImages = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setShowImage(ev.target.checked);
        LocalStore.setItem<boolean>(localStorageKeys.items.showImages, ev.target.checked);
    }
    const onChangeRowsPerPage = (value: number) => {
        LocalStore.setItem(storeProductItemsRowsPerPage, value);
        setRowsPerPage(value);
    }

    const selectItemHandler = (item: ProductColorItem) => dispatch(setCurrentColorItem(item));

    if (!product) {
        return null;
    }
    return (
        <>
            <hr/>
            <Row className="g-3 align-items-baseline mb-3">
                <Col xs="auto">
                    <FormCheck label="Show Inactive" id={showInactiveId} checked={showInactive}
                               onChange={(ev) => setShowInactive(ev.target.checked)} type="checkbox"/>
                </Col>
                <Col xs="auto">
                    <FormCheck label="Show Images" id={showImageId} checked={showImage}
                               onChange={onChangeShowImages} type="checkbox"/>
                </Col>
                <Col>
                    <TablePagination size="sm"
                                     page={page} onChangePage={setPage}
                                     rowsPerPage={rowsPerPage}
                                     rowsPerPageProps={{onChange: onChangeRowsPerPage, label: 'Images'}}
                                     count={filteredList.length}/>
                </Col>
            </Row>
            <Row className="g-3">
                {filteredList
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(item => (
                        <Col key={item.id} xs={12} sm={showImage ? 6 : 4} md={showImage ? 4 : 3} lg="auto" style={{minWidth: '175px'}}>
                            <Card border={selected?.id === item.id ? 'primary' : 'secondary'}
                                  onClick={() => selectItemHandler(item)}>
                                <Card.Header className="p-1">
                                    <div className="d-flex justify-content-between">
                                        <div>
                                            {item.colorCode}
                                        </div>
                                        <SeasonIcon code={item.additionalData?.season?.code}
                                                    seasonAvailable={item.additionalData?.seasonAvailable === true}/>
                                        {!!item.productStatus && (<Badge bg="warning">{item.productStatus}</Badge>)}
                                        <ColorSwatch colorCode={item.colorCode}
                                                     swatchFormat={item.additionalData?.swatch_code}/>
                                    </div>
                                </Card.Header>
                                {showImage && (
                                    <Card.Body className="text-center">
                                        <ProductImage filename={item.additionalData?.image_filename || product?.image}
                                                      className={classNames('m-auto', {'text-danger': !item.status})}
                                                      colorCode={item.colorCode} itemCode={item.itemCode} size={80}/>
                                    </Card.Body>
                                )}
                                <Card.Footer className="text-center">
                                    <small className="text-secondary">Available: {numeral(item.QuantityAvailable).format('0,0')}</small>
                                </Card.Footer>
                            </Card>
                        </Col>
                    ))}
            </Row>
        </>
    )
}
export default ProductColorList;
