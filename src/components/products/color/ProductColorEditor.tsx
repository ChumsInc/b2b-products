import React, {ChangeEvent, FormEvent, useEffect, useId, useRef, useState} from 'react';
import {useSelector} from "react-redux";
import {selectCurrentColorItem, selectCurrentColorStatus} from "@/ducks/products/color/selectors";
import {selectCurrentProduct, selectCurrentProductId} from "@/ducks/products/product/selectors";
import {ProductColorItem, ProductColorItemAdditionalData} from "b2b-types/src/products";
import SeasonSelect from "../../season/SeasonSelect";
import {Editable, ProductColor, ProductSeason} from "b2b-types";
import {defaultColorItem} from "../../../defaults";
import {removeColorItem, saveCurrentColorItem, setCurrentColorItem} from "@/ducks/products/color/actions";
import {useAppDispatch} from "../../app/hooks";
import ColorAutoComplete from "../../colors/ColorAutoComplete";
import classNames from "classnames";
import {TextareaAutosize} from "@mui/base/TextareaAutosize";
import {Badge, Button, Col, Form, FormCheck, FormControl, InputGroup, Row} from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";

const ProductColorEditor = () => {
    const dispatch = useAppDispatch();
    const itemCodeRef = useRef<HTMLInputElement>(null)
    const imageRef = useRef<HTMLInputElement>(null)
    const productId = useSelector(selectCurrentProductId);
    const currentProduct = useSelector(selectCurrentProduct);
    const current = useSelector(selectCurrentColorItem);
    const status = useSelector(selectCurrentColorStatus);
    const seasonAvailableId = useId();
    const statusId = useId();
    const seasonId = useId();

    const [colorItem, setColorItem] = useState<ProductColorItem & Editable>(current ?? {...defaultColorItem});

    useEffect(() => {
        setColorItem({...defaultColorItem, productId});
        dispatch(setCurrentColorItem(null));
    }, [productId]);

    useEffect(() => {
        setColorItem({...(current ?? defaultColorItem), productId});
    }, [current])

    const submitHandler = async (ev: FormEvent) => {
        ev.preventDefault();
        await dispatch(saveCurrentColorItem({...colorItem, productId}));
        // setColorItem({...defaultColorItem, productId});
    }

    const textChangeHandler = (field: keyof ProductColorItem) => (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        switch (field) {
            case 'itemCode':
            case 'colorCode':
                return setColorItem({...colorItem, [field]: ev.target.value, changed: true});
        }
    }

    const onChangeColorCode = (value: string) => setColorItem({...colorItem, colorCode: value, changed: true});

    const onChangeColor = (color: ProductColor | null) => {
        if (color) {
            return setColorItem({...colorItem, color, colorCode: color.code, changed: true})
        }
    }

    const additionalDataChangeHandler = (field: keyof ProductColorItemAdditionalData) =>
        (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const additionalData: ProductColorItemAdditionalData = {...(colorItem?.additionalData ?? {})};
            switch (field) {
                case 'seasonAvailable':
                    additionalData[field] = (ev as ChangeEvent<HTMLInputElement>).target.checked;
                    return setColorItem({...colorItem, additionalData, changed: true});
                case 'swatch_code':
                case 'image_filename':
                case 'message':
                    additionalData[field] = ev.target.value;
                    return setColorItem({...colorItem, additionalData, changed: true});
            }
        }

    const toggleChangeHandler = (field: keyof ProductColorItem) => () => {
        switch (field) {
            case 'status':
                return setColorItem({...colorItem, [field]: !colorItem[field], changed: true});
        }
    }

    const seasonChangeHandler = (season: ProductSeason | null) => {
        const additionalData: ProductColorItemAdditionalData = {...(colorItem.additionalData || {})};
        additionalData.season_id = season?.product_season_id || 0;
        additionalData.season = season || undefined;
        return setColorItem({...colorItem, additionalData, changed: true});
    }

    const newItemHandler = () => {
        if (!colorItem.changed || window.confirm('Are you sure you want to discard your changes?')) {
            dispatch(setCurrentColorItem({...defaultColorItem, productId}));
        }
    }

    const deleteItemHandler = () => {
        if (!current || !productId || status !== 'idle') {
            return;
        }
        if (window.confirm(`Are you sure you want to delete item ${current.itemCode}?`)) {
            dispatch(removeColorItem(current));
        }
    }

    return (
        <>
            <Form onSubmit={submitHandler}>
                <Form.Group as={Row}>
                    <Form.Label column xs={4}>ID</Form.Label>
                    <Col>
                        <FormControl type="number" readOnly value={colorItem.id} size="sm" className="text-center"/>
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column xs={4}>Color Code</Form.Label>
                    <Col>
                        <ColorAutoComplete value={colorItem.colorCode} onChange={onChangeColorCode}
                                           swatchFormat={colorItem.additionalData?.swatch_code ?? currentProduct?.additionalData?.swatch_format}
                                           onChangeColor={onChangeColor}/>
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column xs={4}>Item Code</Form.Label>
                    <Col>
                        <FormControl type="text" size="sm" ref={itemCodeRef}
                                     value={colorItem.itemCode} onChange={textChangeHandler('itemCode')} required/>
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column xs={4}>Image</Form.Label>
                    <Col>
                        <FormControl type="text" size="sm" ref={imageRef}
                                     placeholder={currentProduct?.image}
                                     value={colorItem.additionalData?.image_filename || ''}
                                     onChange={additionalDataChangeHandler('image_filename')}/>
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column xs={4}>Swatch Code</Form.Label>
                    <Col>
                        <FormControl type="text" size="sm" ref={imageRef}
                                     placeholder={currentProduct?.additionalData?.swatch_code ?? ''}
                                     value={colorItem.additionalData?.swatch_code || ''}
                                     onChange={additionalDataChangeHandler('swatch_code')}/>
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column xs={4}>Status</Form.Label>
                    <Col xs="auto">
                        <FormCheck type="checkbox" id={statusId} checked={colorItem.status}
                                   onChange={toggleChangeHandler('status')} label="Enabled"/>
                    </Col>
                    <Col xs="auto">
                        {(colorItem.inactiveItem || colorItem.productType === 'D') &&
                            <Badge bg="danger">Inactive</Badge>}
                        {!!colorItem.productStatus && <Badge bg="warning">{colorItem.productStatus}</Badge>}
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column xs={4}>Item Message</Form.Label>
                    <Col>
                        <FormControl as={TextareaAutosize} size="sm"
                                     value={colorItem.additionalData?.message ?? ''}
                                     onChange={additionalDataChangeHandler('message')}/>
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column xs={4} htmlFor={seasonId}>Season</Form.Label>
                    <Col>
                        <InputGroup size="sm">
                            <SeasonSelect id={seasonId} value={colorItem.additionalData?.season?.code || ''}
                                          onChange={seasonChangeHandler}/>
                            <InputGroup.Text as="label" htmlFor={seasonAvailableId}>Available</InputGroup.Text>
                            <InputGroup.Checkbox id={seasonAvailableId}
                                                 checked={colorItem.additionalData?.seasonAvailable ?? false}
                                                 onChange={additionalDataChangeHandler('seasonAvailable')}
                                                 disabled={!colorItem.additionalData?.season_id}/>
                        </InputGroup>
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column xs={4}>Actions</Form.Label>
                    <Col>
                        <Button type="submit"
                                className={classNames("btn btn-sm me-1", {
                                    'btn-primary': !colorItem.changed,
                                    'btn-warning': colorItem.changed
                                })}
                                disabled={!productId || status !== 'idle'}>
                            {status === 'saving' && (
                                <Spinner animation="border" variant="primary" size="sm" role="status" aria-hidden/>
                            )}
                            {colorItem.changed && <span className="bi-exclamation-triangle-fill me-1"/>}
                            Save
                        </Button>
                    </Col>
                    <Col>
                        <Button type="button" variant="outline-secondary" size="sm"
                                disabled={!productId} onClick={newItemHandler}>
                            New Product
                        </Button>
                    </Col>
                    <Col>
                        <Button type="button" color="danger" size="sm"
                                onClick={deleteItemHandler}
                                disabled={!current?.id || !productId || status !== 'idle'}>
                            {status === 'deleting' && <Spinner as="span" role="status" aria-hidden="true"/>}
                            Delete
                        </Button>
                    </Col>
                </Form.Group>
            </Form>
        </>
    )
}

export default ProductColorEditor;
