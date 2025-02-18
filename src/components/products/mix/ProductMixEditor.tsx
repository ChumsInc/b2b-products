import React, {ChangeEvent, FormEvent, useEffect, useId, useState} from 'react';
import {useSelector} from "react-redux";
import {selectCurrentMix, selectCurrentMixStatus} from "@/ducks/products/mix/selectors";
import {ProductMixItem} from "b2b-types/src/products";
import {loadMixBOM, saveMix} from "@/ducks/products/mix/actions";
import {selectCurrentProduct} from "@/ducks/products/product/selectors";
import {useAppDispatch} from "../../app/hooks";
import {Editable} from "b2b-types";
import {defaultMixItem} from "@/ducks/products/mix/utils";
import {Alert, Col, Form, FormCheck, FormControl, Row} from "react-bootstrap";
import SpinnerButton from "@/components/common/SpinnerButton";

const ProductMixEditor: React.FC = () => {
    const dispatch = useAppDispatch();
    const product = useSelector(selectCurrentProduct);
    const current = useSelector(selectCurrentMix);
    const status = useSelector(selectCurrentMixStatus);
    const id = useId();
    const nameId = useId();
    const statusId = useId();


    const [mix, setMix] = useState<ProductMixItem & Editable>(current ?? {...defaultMixItem});

    useEffect(() => {
        setMix({...(current ?? defaultMixItem)});
    }, [current]);

    useEffect(() => {
        if (current) {
            dispatch(loadMixBOM(current.itemCode));
        }
    }, [current?.itemCode]);


    const submitHandler = (ev: FormEvent) => {
        ev.preventDefault();
        dispatch(saveMix(mix));
    }

    const textChangeHandler = (field: keyof ProductMixItem) => (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        switch (field) {
            case 'itemCode':
            case 'mixName':
                return setMix({...mix, [field]: ev.target.value, changed: true});
        }
    }

    const toggleChangeHandler = (field: keyof ProductMixItem) => () => {
        if (!current) {
            return;
        }
        switch (field) {
            case 'status':
                return setMix({...mix, [field]: !current[field], changed: true});
        }
    }

    return (
        <>
            <Form onSubmit={submitHandler} className="mt-3">
                <Form.Group as={Row}>
                    <Form.Label column={true} xs={4} lg={3} htmlFor={id}>ID / Item Code</Form.Label>
                    <Col>
                        <FormControl id={id} size="sm" readOnly value={mix.id}/>
                    </Col>
                    <Col>
                        <FormControl readOnly size="sm" value={mix.itemCode} aria-label="Mix Item Code"/>
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column={true} xs={4} lg={3} htmlFor={nameId}>Name</Form.Label>
                    <Col>
                        <FormControl type="text" size="sm"
                                     value={mix.mixName} onChange={textChangeHandler('mixName')} required/>
                    </Col>

                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column={true} xs={4} lg={3}>Status</Form.Label>
                    <Col>
                        <FormCheck label='Enabled' id={statusId} checked={mix.status}
                                   onChange={toggleChangeHandler('status')}
                                   type="checkbox" inline/>
                        <FormCheck label='Inactive' checked={!!mix.inactiveItem} disabled
                                   type="checkbox" inline/>
                        <FormCheck label='Disco' checked={mix.productType === 'D'} disabled
                                   type="checkbox" inline/>
                    </Col>
                    {mix.productType === null && (
                        <Alert variant="danger">Item <strong>{mix.itemCode}</strong> does not exist.</Alert>
                    )}
                </Form.Group>
                <Row className="justify-content-end">
                    <Col xs="auto">
                        <SpinnerButton type="submit" variant="primary" size="sm"
                                       disabled={!product?.id || status !== 'idle'}>
                            Save
                        </SpinnerButton>
                    </Col>
                </Row>
                {mix.changed && <Alert color="warning">Don&apos;t forget to save your changes.</Alert>}
            </Form>
        </>
    )
}

export default ProductMixEditor;
