import React, {ChangeEvent, FormEvent, useEffect, useId, useState} from 'react';
import {useSelector} from "react-redux";
import SpinnerButton from "@/components/common/SpinnerButton";
import {
    selectCurrentProductVariants,
    selectCurrentVariant,
    selectCurrentVariantSaving
} from "@/ducks/products/variant/selectors";
import {ProductVariant} from "b2b-types/src/products";
import {Editable, Keyword} from "b2b-types";
import KeywordSelectInputGroup from "../../keywords/KeywordSelectInputGroup";
import {defaultVariant} from "@/src/defaults";
import {removeVariant, saveCurrentVariant, setDefaultVariant} from "@/ducks/products/variant/actions";
import {selectCurrentProductId} from "@/ducks/products/product/selectors";
import {useAppDispatch} from "../../app/hooks";
import ProductImage from "./ProductImage";
import {Alert, Button, Col, Collapse, Form, FormCheck, FormControl, InputGroup, Row} from "react-bootstrap";
import {Link} from "react-router";


const colWidth = 9;
const ProductVariantsEditor = () => {
    const dispatch = useAppDispatch();
    const productId = useSelector(selectCurrentProductId);
    const current = useSelector(selectCurrentVariant);
    const saving = useSelector(selectCurrentVariantSaving);
    const currentVariants = useSelector(selectCurrentProductVariants);
    const [variant, setVariant] = useState<ProductVariant & Editable>(current ?? {...defaultVariant});
    const [alert, setAlert] = useState<string | null>(null);
    const variantIdId = useId();
    const productSelectId = useId();
    const enabledId = useId();


    useEffect(() => {
        if (!variant?.id || variant?.parentProductID !== productId) {
            const variant: ProductVariant = {...defaultVariant, parentProductID: productId};
            console.log('useEffect()', productId, variant);
            setVariant(variant);
            setAlert(null);
        }
    }, [productId]);

    useEffect(() => {
        setVariant(current ? {...current} : {...defaultVariant, parentProductID: productId});
        setAlert(null);
    }, [current]);

    const submitHandler = async (ev: FormEvent) => {
        ev.preventDefault();
        await dispatch(saveCurrentVariant(variant));
    }

    const changeHandler = (field: keyof ProductVariant) => (ev: ChangeEvent<HTMLInputElement & HTMLTextAreaElement>) => {
        switch (field) {
            case 'title':
                return setVariant({...variant, [field]: ev.target.value, changed: true});
            case 'status':
                return setVariant({...variant, [field]: ev.target.checked, changed: true});
        }
    }

    const keywordChangeHandler = (kw: Keyword | null) => {
        let alert = kw?.id === productId ? 'A variant cannot be its own parent' : null;
        const [exists] = currentVariants.filter(v => v.id !== variant.id && v.variantProductID === kw?.id);
        if (exists && !alert) {
            alert = `This variant product already exists in the current product`;
        }
        setAlert(alert);
        setVariant({...variant, status: Boolean(kw?.status ?? false), variantProductID: kw?.id ?? 0});
    }

    const newVariantHandler = () => {
        if (!productId) {
            return;
        }
        if (!variant.changed || window.confirm('Are you sure you want to discard your changes?')) {
            setVariant({...defaultVariant, parentProductID: productId});
            setAlert(null)
        }
    }

    const deleteVariantHandler = async () => {
        if (!current) {
            return;
        }
        if (window.confirm('Are you sure you want to delete this variant?')) {
            await dispatch(removeVariant(current));
        }
    }

    const defaultVariantHandler = () => {
        if (!current) {
            return;
        }
        if (window.confirm('Are you sure you want to make this the default variant?')) {
            dispatch(setDefaultVariant(current));
        }
    }

    return (
        <Row>
            <Col md={8} xs={12}>
                <Form onSubmit={submitHandler}>
                    <Form.Group as={Row} label="ID" width={colWidth}>
                        <Form.Label column={true} xs={4} lg={3} htmlFor={variantIdId}>ID</Form.Label>
                        <Col>
                            <FormControl type="number" readOnly id={variantIdId} size="sm"
                                         value={variant.id}/>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label column={true} xs={4} lg={3} htmlFor={productSelectId}>Child</Form.Label>
                        <Col>
                            <KeywordSelectInputGroup pageType="product" id={productSelectId}
                                                     value={variant.variantProductID}
                                                     required
                                                     onSelectKeyword={keywordChangeHandler}>
                                {variant.product && (
                                    <InputGroup.Text as={Link} to={`/products/${variant.product?.keyword}`}>
                                        <span className="bi-link" aria-label="Edit Variant"/>
                                    </InputGroup.Text>
                                )}
                            </KeywordSelectInputGroup>
                            <Collapse in={typeof alert === 'string' && alert.length > 0}>
                                <div>
                                    <Alert variant="danger">{JSON.stringify(alert)}</Alert>
                                </div>
                            </Collapse>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                        <Form.Label column={true} xs={4} lg={3} htmlFor={productSelectId}>Name</Form.Label>
                        <Col>
                            <FormControl type="text" size="sm"
                                         value={variant.title} onChange={changeHandler('title')} required/>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                        <Form.Label column={true} xs={4} lg={3} htmlFor={enabledId}>Status</Form.Label>
                        <Col>
                            <FormCheck label='Enabled' id={enabledId}
                                       checked={variant.status} onChange={changeHandler('status')}
                                       disabled={!variant.product?.status}
                                       type="checkbox" inline/>
                        </Col>
                    </Form.Group>

                    <Row className="justify-content-end g-3">
                        <Col xs="auto">
                            <SpinnerButton type="submit" variant="primary" size="sm"
                                           disabled={!!alert || !productId}
                                           spinning={saving}>Save</SpinnerButton>
                        </Col>
                        <Col xs="auto">
                            <Button type="button" size="sm" variant="outline-secondary"
                                    onClick={newVariantHandler}
                                    disabled={!productId}>
                                New
                            </Button>

                        </Col>
                        <Col xs="auto">
                            <Button type="button" size="sm" variant="outline-danger"
                                    onClick={deleteVariantHandler}
                                    disabled={!productId}>
                                Delete
                            </Button>
                        </Col>
                        <Col xs="auto">
                            <Button type="button" variant="outline-info" size="sm"
                                    onClick={defaultVariantHandler}
                                    disabled={variant.isDefaultVariant || !variant.id}>
                                {variant.isDefaultVariant && <>Default Variant</>}
                                {!variant.isDefaultVariant && <>Set Default Variant</>}
                            </Button>
                        </Col>
                    </Row>
                    {variant.changed && <Alert color="warning">Don&#39;t forget to save your changes.</Alert>}
                </Form>
            </Col>
            <Col md={4} xs={12}>
                <ProductImage imageUrl={variant.product?.image} defaultColor={variant.product?.defaultColor}
                              size="400"/>
            </Col>
        </Row>
    )
}

export default ProductVariantsEditor;
