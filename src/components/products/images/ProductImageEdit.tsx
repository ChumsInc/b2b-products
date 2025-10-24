import {type ChangeEvent, type FormEvent, useEffect, useId, useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {removeImage, saveImage} from "@/ducks/products/actions/images-actions.ts";
import type {Editable, ProductAlternateImage} from "b2b-types";
import {selectCurrentProductId} from "@/ducks/products/productSlice.ts";
import classNames from "classnames";
import ProductImage from "../../app/ProductImage";
import {selectCurrentImage, selectImagesStatus, setCurrentImage} from "@/ducks/products/productImagesSlice";
import {Alert, Button, Col, Form, FormCheck, Row} from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";

const newImage: ProductAlternateImage = {
    id: 0,
    image: '',
    status: true,
    altText: '',
    priority: 0,
    productId: 0,
}
const ProductImageEdit = () => {
    const dispatch = useAppDispatch();
    const productId = useAppSelector(selectCurrentProductId);
    const current = useAppSelector(selectCurrentImage);
    const status = useAppSelector(selectImagesStatus);
    const [image, setImage] = useState<ProductAlternateImage & Editable>(current ?? {...newImage, productId});
    const filenameRef = useRef<HTMLInputElement | null>(null);
    const filenameId = useId();
    const altTextID = useId();
    const activeId = useId();
    const priorityId = useId();

    useEffect(() => {
        setImage(current || {...newImage, productId});
    }, [current, productId]);

    const changeHandler = (field: keyof ProductAlternateImage) => (ev: ChangeEvent<HTMLInputElement>) => {
        switch (field) {
            case 'image':
            case 'altText':
                return setImage({...image, [field]: ev.target.value, changed: true});
            case 'status':
                return setImage({...image, [field]: ev.target.checked, changed: true});
            case 'priority':
                return setImage({...image, [field]: ev.target.valueAsNumber, changed: true});
        }
    }

    const submitHandler = async (ev: FormEvent) => {
        ev.preventDefault();
        if (!productId || !image.image) {
            return;
        }
        await dispatch(saveImage(image));
        if (image.id === 0) {
            newImageHandler();
        }
    }

    const newImageHandler = () => {
        dispatch(setCurrentImage(null));
        setImage({...newImage, productId});
        filenameRef.current?.focus();
    }

    const deleteImageHandler = async () => {
        if (!productId || !image.id || !window.confirm('Are you sure you want to delete this image?')) {
            return;
        }
        await dispatch(removeImage(image));
        newImageHandler();
    }

    return (
        <Row as="form" onSubmit={submitHandler}>
            <Col xs={12} lg={6}>
                <Form.Group as={Row}>
                    <Form.Label column={true} xs={4}>ID</Form.Label>
                    <Col>
                        <Form.Control type="text" value={image.id ?? 'new'} readOnly disabled size="sm"/>
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column={true} xs={4} htmlFor={filenameId}>File Name</Form.Label>
                    <Col>
                        <Form.Control type="text" id={filenameId} size="sm"
                                      value={image.image} onChange={changeHandler('image')}
                                      ref={filenameRef}/>
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column={true} xs={4} htmlFor={altTextID}>Alt Text</Form.Label>
                    <Col>
                        <Form.Control type="text" id={altTextID} size="sm"
                                      value={image.altText} onChange={changeHandler('altText')}
                                      ref={filenameRef}/>
                        <Form.Text className="text-secondary">Use #SKU to show for only that SKU</Form.Text>
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column={true} xs={4} htmlFor={activeId}>Active</Form.Label>
                    <Col>
                        <FormCheck type="checkbox" label="Active" id={activeId}
                                   checked={!!image.status} onChange={changeHandler('status')}/>
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column={true} xs={4} htmlFor={priorityId}>Priority</Form.Label>
                    <Col>
                        <Form.Control type="number" id={priorityId} size="sm" step={1} min={0} className="text-end"
                                      value={image.priority} onChange={changeHandler('priority')}/>
                    </Col>
                </Form.Group>
                <hr/>
                <Row>
                    <Col>
                        <Button type="submit" variant="primary" size="sm"
                                disabled={!productId || !image.image || status !== 'idle'}>
                            {status === 'saving' && (<Spinner size="sm" role="status" aria-hidden="true"/>)}
                            Save
                        </Button>
                    </Col>
                    <Col>
                        <Button type="button" variant="outline-secondary" size="sm" onClick={newImageHandler}>
                            New Image
                        </Button>
                    </Col>
                    <Col>
                        <Button type="button" variant="outline-danger" size="sm" onClick={deleteImageHandler}
                                disabled={!productId || !image.id || status !== 'idle'}>
                            {status === 'deleting' && (<Spinner size="sm" role="status" aria-hidden="true"/>)}
                            Delete
                        </Button>

                    </Col>
                </Row>
                {image.changed && (
                    <Alert variant="warning">Don&apos;t forget to save your changes.</Alert>
                )}
            </Col>
            <Col lg={6} className="d-none d-lg-block">
                {current?.image && (
                    <ProductImage filename={current.image}
                                  className={classNames({'text-danger': !current.status})}
                                  itemCode={current.altText} size={250}/>
                )}
            </Col>
        </Row>
    )
}

export default ProductImageEdit;
