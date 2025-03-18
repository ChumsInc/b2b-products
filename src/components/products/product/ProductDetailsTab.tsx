import React, {ChangeEvent, FormEvent, useId, useState} from 'react';
import {useSelector} from "react-redux";
import {selectCurrentProduct, selectCurrentProductSaving} from "@/ducks/products/product/selectors";
import {Product, ProductAdditionalData} from "b2b-types/src/products";
import ModalEditor from "../../app/ModalEditor";
import {saveProduct, updateProduct, updateProductAdditionalData} from "@/ducks/products/product/actions";
import {useAppDispatch} from "../../app/hooks";
import CodeEditButton from "./CodeEditButton";
import {Alert, Col, Form, FormControl, Row} from "react-bootstrap";
import SpinnerButton from "../../common/SpinnerButton";
import TextArea from "@/components/common/TextArea";

const colWidth = 8;
const ProductDetailsTab: React.FC = () => {
    const dispatch = useAppDispatch();
    const product = useSelector(selectCurrentProduct);
    const saving = useSelector(selectCurrentProductSaving);

    const [showEditor, setShowEditor] = useState(false);
    const [editorField, setEditorField] = useState<'details' | 'description'>('details');

    const nameId = useId();
    const subtitleId = useId();
    const sizesId = useId();
    const sizeListId = useId();
    const descriptionId = useId();
    const detailsId = useId();
    const priceId = useId();

    const submitHandler = async (ev: FormEvent) => {
        ev.preventDefault();
        if (!product) {
            return;
        }
        await dispatch(saveProduct(product));
    }

    const textChangeHandler = (field: keyof Product) => (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        switch (field) {
            case 'description':
            case 'details':
                return dispatch(updateProduct({[field]: ev.target.value}));
        }
    }
    const additionalDataChangeHandler = (field: keyof ProductAdditionalData) =>
        (ev: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {

            switch (field) {
                case 'subtitle':
                case 'size':
                case 'formatted_name':
                case 'swatch_format':
                    return dispatch(updateProductAdditionalData({[field]: ev.target.value}));
            }
        }

    const onShowEditor = (field: 'details' | 'description') => () => {
        setEditorField(field)
        setShowEditor(true);
    }
    const onCloseEditor = (value: string) => {
        if (!product) {
            return;
        }
        if (value !== product[editorField]) {
            dispatch(updateProduct({[editorField]: value}));
        }
        setShowEditor(false);
    }

    const onCancelEditor = () => {
        setShowEditor(false);
    }

    if (!product) {
        return null;
    }
    return (
        <>
            <Form onSubmit={submitHandler} className="mt-3">
                <Form.Group as={Row}>
                    <Form.Label column={true} xs={4} lg={3} htmlFor={nameId}>
                        Formatted Name <small className="bi-code ms-1"/>
                    </Form.Label>
                    <Col>
                        <FormControl as={TextArea} size="sm" className="font-monospace mb-2" minRows={2}
                                     value={product.additionalData?.formatted_name || ''}
                                     onChange={additionalDataChangeHandler('formatted_name')}/>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} label="Subtitle" width={colWidth}>
                    <Form.Label column={true} xs={4} lg={3} htmlFor={subtitleId}>Subtitle</Form.Label>
                    <Col>
                        <FormControl type="text" size="sm"
                                     value={product.additionalData?.subtitle || ''}
                                     onChange={additionalDataChangeHandler('subtitle')}/>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} label="Size" width={colWidth}>
                    <Form.Label column={true} xs={4} lg={3} htmlFor={sizesId}>Sizes</Form.Label>
                    <Col>
                        <FormControl type="text" size="sm" id={sizesId}
                                     value={product.additionalData?.size || ''}
                                     onChange={additionalDataChangeHandler('size')}
                                     list={sizeListId}/>
                        <datalist id={sizeListId}>
                            <option value="XS">XS</option>
                            <option value="SM">SM</option>
                            <option value="MD">MD</option>
                            <option value="LG">LG</option>
                            <option value="XL">XL</option>
                            <option value="XXL">XXL</option>
                        </datalist>
                        <Form.Text className="text-secondary">Comma separated size list</Form.Text>
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column={true} xs={4} lg={3} htmlFor={descriptionId}>
                        <CodeEditButton onClick={onShowEditor('description')}>Description</CodeEditButton>
                    </Form.Label>
                    <Col>
                        <FormControl as={TextArea} size="sm" className="font-monospace mb-2"
                                     minRows={2} maxRows={10}
                                     value={product.description} onChange={textChangeHandler('description')}/>
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column={true} xs={4} lg={3} htmlFor={detailsId}>
                        <CodeEditButton onClick={onShowEditor('details')}>Details</CodeEditButton>
                    </Form.Label>
                    <Col>
                        <FormControl as={TextArea} size="sm" className="font-monospace mb-2"
                                     minRows={2} maxRows={10}
                                     value={product.details} onChange={textChangeHandler('details')}/>

                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column={true} xs={4} lg={3} htmlFor={priceId}>Anticipated Price</Form.Label>
                    <Col>
                        <FormControl type="text" size="sm" id={priceId} className="text-end"
                                     value={product.anticipatedPrice || 0}
                                     onChange={additionalDataChangeHandler('subtitle')}/>
                    </Col>
                </Form.Group>
                <Row className="justify-content-end">
                    <Col xs="auto">
                        <SpinnerButton type="submit" variant="primary" size="sm" className="me-1" spinning={saving}>
                            Save
                        </SpinnerButton>
                    </Col>
                </Row>
                {product.changed && <Alert variant="warning">Don&apos;t forget to save your changes.</Alert>}
            </Form>
            <ModalEditor show={showEditor} title={`edit value.${editorField}`}
                         content={String(product[editorField]) || ''}
                         onClose={onCloseEditor} onCancel={onCancelEditor}/>
        </>
    )
}

export default ProductDetailsTab;
