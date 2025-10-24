import React, {type ChangeEvent, type FormEvent, useEffect, useId, useRef, useState} from 'react';
import type {ProductColor, ProductMixComponent, ProductMixItem} from "b2b-types";
import {deepStrictEqual} from "@/src/utils";
import ItemFormControl from "@/components/common/ItemFormControl";
import type {BOMComponent, ItemSearchRecord} from "@/types/item-search";
import {selectCurrentMixComponents, selectCurrentMixStatus} from "@/ducks/products/productMixSlice";
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import ColorAutoComplete from "@/components/colors/ColorAutoComplete";
import {Alert, Button, Col, Form, FormControl, ProgressBar, Row} from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import SpinnerButton from "@/components/common/SpinnerButton";
import {saveMixComponent} from "@/ducks/products/actions/mix-actions.ts";
import {defaultMixComponent} from "@/ducks/products/utils/mix-utils.ts";
import {JSONView} from "@chumsinc/json-view";
import BOMDetailTable from "@/components/products/mix/BOMDetailTable";

export interface MixComponentEditorProps {
    mix: ProductMixItem | null;
    value: ProductMixComponent | null;
    show: boolean;
    onClose: () => void;
}

export default function MixComponentEditor({mix, value, show, onClose}: MixComponentEditorProps) {
    const dispatch = useAppDispatch();
    const components = useAppSelector(selectCurrentMixComponents);
    const status = useAppSelector(selectCurrentMixStatus);
    const [component, setComponent] = React.useState<ProductMixComponent>(value ?? {
        ...defaultMixComponent,
        mixID: mix?.id ?? 0
    });
    const [existing, setExisting] = useState<string[]>([]);
    const [isEqual, setEqual] = React.useState(true);
    const itemId = useId();
    const formId = useId();
    const colorInputId = useId();
    const quantityInputId = useId();
    const itemRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        setExisting(components.map(c => c.itemCode.toUpperCase()).sort());
    }, [component]);

    useEffect(() => {
        if (value) {
            setComponent({...value});
            setEqual(true);
        } else {
            setComponent({...defaultMixComponent, mixID: mix?.id ?? 0});
        }
    }, [mix, value]);

    const selectBOMComponent = (item: BOMComponent) => {
        setComponent({
            ...defaultMixComponent,
            mixID: mix?.id ?? 0,
            itemCode: item.ComponentItemCode,
            itemQuantity: +item.QuantityPerBill,
        });
    }

    const changeHandler = (field: keyof Pick<ProductMixComponent, 'itemCode' | 'itemQuantity' | 'color_code'>) =>
        (ev: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
            if (!component) {
                return;
            }
            let next: ProductMixComponent = {...component};
            switch (field) {
                case 'itemQuantity':
                    next = {...next, [field]: (ev.target as HTMLInputElement).valueAsNumber};
                    break;
                case 'color_code':
                case 'itemCode':
                    next = {...next, [field]: ev.target.value.toUpperCase()};
                    break;
            }
            setComponent(next);
            setEqual(deepStrictEqual(next, value));
        }
    const onChangeColor = (color: ProductColor) => {
        const next: ProductMixComponent = {
            ...component,
            color,
            color_code: color.code,
            color_name: color.name,
            colorsId: color.id
        };
        setComponent(next);
        setEqual(deepStrictEqual(next, value));
    }

    const itemChangeHandler = (item: ItemSearchRecord | null) => {
        if (!component) {
            return;
        }
        const next: ProductMixComponent = {...component, itemCode: item?.ItemCode ?? ''};
        setComponent(next);
        setEqual(deepStrictEqual(next, value));
    }

    const submitHandler = (ev: FormEvent) => {
        ev.preventDefault();
        if (!mix || !mix?.productId) {
            return;
        }
        dispatch(saveMixComponent({productId: mix.productId, component: component}));
        setComponent({...defaultMixComponent, mixID: mix.id});
        itemRef.current?.focus();
    }

    return (
        <Modal show={show} onHide={onClose} size="lg">
            <Modal.Header closeButton closeLabel="Cancel Changes">
                <Modal.Title>Add Mix Component</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col md={6}>
                        <Form onSubmit={submitHandler} id={formId}>
                            <Form.Group as={Row}>
                                <Form.Label column={true} xs={4} htmlFor={itemId}>Item Code</Form.Label>
                                <Col>
                                    <ItemFormControl size="sm" id={itemId} required ref={itemRef}
                                                     value={component.itemCode} onChange={changeHandler('itemCode')}
                                                     onChangeItem={itemChangeHandler}/>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row}>
                                <Form.Label column={true} xs={4} htmlFor={colorInputId}>
                                    Color Code
                                </Form.Label>
                                <Col>
                                    <ColorAutoComplete size="sm" className="mb-2"
                                                       inputProps={{
                                                           id: colorInputId,
                                                           onChange: changeHandler('color_code'),
                                                           "aria-label": 'Color Code',
                                                           required: true
                                                       }}
                                                       value={component.color_code ?? ''}
                                                       onChangeColor={onChangeColor}/>

                                </Col>
                            </Form.Group>
                            <Form.Group as={Row}>
                                <Form.Label column={true} xs={4} htmlFor={quantityInputId}>
                                    Item Quantity
                                </Form.Label>
                                <Col>
                                    <FormControl type="number" size="sm" min={1} id={quantityInputId}
                                                 value={component.itemQuantity || ''}
                                                 onChange={changeHandler('itemQuantity')}
                                                 required/>
                                </Col>
                            </Form.Group>
                        </Form>
                        {existing.includes(component.itemCode.toUpperCase()) && (
                            <Alert variant="warning">
                                This mix already contains <strong>{component.itemCode.toUpperCase()}</strong>
                            </Alert>
                        )}
                        <JSONView data={component} defaultOpenLevels={1}/>
                    </Col>
                    <Col md={6}>
                        <BOMDetailTable onClick={selectBOMComponent}/>
                    </Col>
                </Row>


            </Modal.Body>
            <Modal.Footer>
                {status !== 'idle' && <ProgressBar variant="primary" striped animated/>}
                <Button type="button" variant="outline-secondary" size="sm" onClick={onClose}>Cancel</Button>
                <SpinnerButton form={formId} variant="primary" type="submit" size="sm"
                               spinning={status === 'saving'}
                               disabled={!mix?.productId || status !== 'idle' || isEqual}>
                    Save
                </SpinnerButton>
            </Modal.Footer>
        </Modal>
    )
}
