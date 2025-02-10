import React, {ChangeEvent, FormEvent, useEffect, useId, useRef, useState} from 'react';
import {useSelector} from "react-redux";
import {
    selectCurrentMix,
    selectCurrentMixComponents,
    selectCurrentMixStatus
} from "../../../ducks/products/mix/selectors";
import {ProductMixComponent} from "b2b-types/src/products";
import ItemDataList from "../../item-search/ItemDataList";
import {saveMixComponent} from "../../../ducks/products/mix/actions";
import ProductMixComponentRow from "./ProductMixComponentRow";
import {useAppDispatch} from "../../app/hooks";
import ColorAutoComplete from "../../colors/ColorAutoComplete";
import {ProductColor} from "b2b-types";
import BOMDetail from "./BOMDetail";
import {defaultMixComponent} from "../../../ducks/products/mix/utils";
import {Alert, Button, Col, Form, FormControl, Row} from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";


const colWidth = 8;
const ProductMixComponents = () => {
    const dispatch = useAppDispatch();
    const mix = useSelector(selectCurrentMix);
    const components = useSelector(selectCurrentMixComponents);
    const status = useSelector(selectCurrentMixStatus);
    const itemCodeRef = useRef<HTMLInputElement | null>(null);
    const itemId = useId();
    const itemColorsListId = useId();
    const colorCodeId = useId();
    const quantityId = useId();

    const [component, setComponent] = useState<ProductMixComponent>({
        ...defaultMixComponent,
        mixID: mix?.id ?? 0
    });

    useEffect(() => {
        setComponent({...defaultMixComponent, mixID: mix?.id ?? 0});
    }, [mix?.id])

    const submitHandler = (ev: FormEvent) => {
        if (!mix?.productId) {
            return;
        }
        ev.preventDefault();
        dispatch(saveMixComponent({productId: mix.productId, component: component}));
        setComponent({...defaultMixComponent, mixID: mix.id});
        itemCodeRef.current?.focus();
    }

    const updateNewComponent = (field: keyof ProductMixComponent) => (ev: ChangeEvent<HTMLInputElement>) => {
        switch (field) {
            case 'itemCode':
            case 'color_code':
                return setComponent({...component, [field]: ev.target.value});
            case 'itemQuantity':
                return setComponent({...component, itemQuantity: ev.target.valueAsNumber});
        }
    }

    const onChangeColor = (color: ProductColor) => {
        setComponent({...component, color, color_code: color.code, color_name: color.name, colorsId: color.id});
    }

    return (
        <>
            <hr/>
            <div className="row g-3">
                <div className="col-md-6 col-lg-5">
                    <h4>New Component</h4>
                    <Form onSubmit={submitHandler} className="mt-3">
                        <Form.Group as={Row}>
                            <Form.Label column={true} xs={4} htmlFor={itemId}>
                                Item Code
                            </Form.Label>
                            <Col>
                                <FormControl type="text" value={component.itemCode}
                                             size="sm"
                                             required ref={itemCodeRef} id={itemId}
                                             list={itemColorsListId}
                                             onChange={updateNewComponent('itemCode')}/>
                                <ItemDataList id={itemColorsListId} search={component.itemCode}/>
                                {!!components
                                    .filter(comp => comp.itemCode === component.itemCode
                                        || comp.colorsId === component.colorsId)
                                    .length && (
                                    <Alert variant="danger">That item already exists in this mix.</Alert>
                                )}
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label column={true} xs={4} htmlFor={colorCodeId}>Color Code</Form.Label>
                            <Col>
                                <ColorAutoComplete id={colorCodeId} value={component.color_code ?? ''} onChangeColor={onChangeColor}/>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label column={true} xs={4} htmlFor={quantityId}>Quantity</Form.Label>
                            <Col>
                                <FormControl type="number" size="sm" min={1}
                                       value={component.itemQuantity || ''} onChange={updateNewComponent('itemQuantity')}
                                       required/>
                            </Col>
                        </Form.Group>
                        <Row className="mt-3 justify-content-end">
                            <Button variant="primary" type="submit" size="sm"
                                    disabled={!mix?.productId || status !== 'idle'}>
                                {status === 'saving' && (
                                    <Spinner as="span" role="status" aria-hidden={true} />
                                )}
                                Add New Component
                            </Button>
                        </Row>
                    </Form>
                </div>
                <div className="col-md-6 col-lg-7">
                    <h4>Components</h4>
                    <table className="table table-sm">
                        <thead>
                        <tr>
                            <th>Item Code</th>
                            <th>Color Code</th>
                            <th>Color Desc</th>
                            <th>Quantity</th>
                            <th className="text-center">Update</th>
                        </tr>
                        </thead>
                        <tbody>
                        {components.map(comp => (
                            <ProductMixComponentRow key={comp.id} productId={mix?.productId ?? 0} component={comp}/>
                        ))}
                        </tbody>
                        <tfoot>
                        <tr>
                            <th colSpan={2}>Total</th>
                            <th>{components.reduce((total, comp) => total + (comp?.itemQuantity || 0), 0)}</th>
                            <th></th>
                        </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
            <hr/>
            <BOMDetail/>
        </>
    )
}

export default ProductMixComponents;
