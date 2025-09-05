import React from 'react';
import {selectCurrentColorItem} from "@/ducks/products/color/selectors";
import {selectCurrentProduct} from "@/ducks/products/product/selectors";
import ProductImage from "../../app/ProductImage";
import {ProductColorItem} from "b2b-types/src/products";
import classNames from "classnames";
import SeasonIcon from "../../season/SeasonIcon";
import {Badge, Card, Col, Row} from "react-bootstrap";
import ColorSwatch from "../../colors/ColorSwatch";
import numeral from "numeral";
import {useAppSelector} from "@/components/app/hooks";

export interface ProductColorGridProps {
    list: ProductColorItem[];
    onSelectItem: (item: ProductColorItem) => void;
}

export default function ProductColorGrid({list, onSelectItem}: ProductColorGridProps) {
    const product = useAppSelector(selectCurrentProduct);
    const selected = useAppSelector(selectCurrentColorItem);

    return (
        <Row className="g-3">
            {list
                .map(item => (
                    <Col key={item.id} xs={12} sm={6} md={4} lg="auto"
                         style={{minWidth: '175px'}}>
                        <Card border={selected?.id === item.id ? 'primary' : 'secondary'}
                              onClick={() => onSelectItem(item)}>
                            <Card.Header className="p-1">
                                <div className="d-flex justify-content-between align-items-baseline">
                                    <div>
                                        {item.colorCode}
                                    </div>
                                    {!item.inactiveItem && (
                                        <SeasonIcon code={item.additionalData?.season?.code}
                                                    seasonAvailable={item.additionalData?.seasonAvailable === true}/>
                                    )}
                                    {!item.inactiveItem && !item.status && (
                                        <Badge bg="secondary">Off</Badge>
                                    )}
                                    {!item.inactiveItem && !!item.productStatus && (
                                        <Badge bg="warning">{item.productStatus}</Badge>)}
                                    {item.inactiveItem && (<Badge bg="danger">Inactive</Badge>)}
                                    <ColorSwatch colorCode={item.colorCode}
                                                 swatchFormat={item.additionalData?.swatch_code ?? product?.additionalData?.swatch_format}>
                                        &nbsp;
                                    </ColorSwatch>
                                </div>
                            </Card.Header>
                            <Card.Body className="text-center">
                                <ProductImage filename={item.additionalData?.image_filename ?? product?.image ?? null}
                                              className={classNames('m-auto', {'text-danger': !item.status})}
                                              colorCode={item.colorCode} itemCode={item.itemCode} size={80}/>
                            </Card.Body>
                            <Card.Footer className="text-center">
                                <small
                                    className="text-secondary">Available: {numeral(item.QuantityAvailable).format('0,0')}</small>
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
        </Row>
    )
}
