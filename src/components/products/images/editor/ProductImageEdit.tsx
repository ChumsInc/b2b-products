import {useCallback, useRef} from "react";
import {useAppDispatch, useAppSelector} from "@/app/configureStore.ts";
import {removeImage, saveImage} from "@/ducks/products/actions/images-actions.ts";
import type {ProductAlternateImage} from "chums-types/b2b";
import {selectCurrentProductId} from "@/ducks/products/productSlice.ts";
import classNames from "classnames";
import ProductImage from "../../../app/ProductImage.tsx";
import {selectImagesStatus} from "@/ducks/products/productImagesSlice.ts";
import {Alert, Button, Col, Collapse, Form, Row} from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import {useProductImages} from "@/components/products/images/useProductImages.ts";
import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import FileNameInput from "@/components/products/images/editor/FileNameInput.tsx";
import AltTextInput from "@/components/products/images/editor/AltTextInput.tsx";
import ImageStatusInput from "@/components/products/images/editor/ImageStatusInput.tsx";
import ImagePriorityInput from "@/components/products/images/editor/ImagePriorityInput.tsx";

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
    const {setCurrentImage} = useProductImages();
    const {value, changed, reset} = useEditorContext<ProductAlternateImage>();
    const productId = useAppSelector(selectCurrentProductId);
    const status = useAppSelector(selectImagesStatus);
    const filenameRef = useRef<HTMLInputElement | null>(null);
    const newImageHandler = useCallback(() => {
        setCurrentImage({...newImage, productId});
        filenameRef.current?.focus();
    }, [productId, setCurrentImage, filenameRef]);

    const submitHandler = async () => {
        if (!productId || !value.image) {
            return;
        }
        await dispatch(saveImage(value));
        if (value.id === 0) {
            newImageHandler();
        }
    }


    const deleteImageHandler = async () => {
        if (!productId || !value.id || !window.confirm('Are you sure you want to delete this image?')) {
            return;
        }
        await dispatch(removeImage(value));
        newImageHandler();
    }

    return (
        <Row as="form" action={submitHandler}>
            <Col xs={12} lg>
                <Form.Group as={Row}>
                    <Form.Label column={true} xs={4}>ID</Form.Label>
                    <Col>
                        <Form.Control type="text" value={value.id ?? 'new'} readOnly disabled size="sm"/>
                    </Col>
                </Form.Group>
                <FileNameInput ref={filenameRef}/>
                <AltTextInput/>
                <ImageStatusInput/>
                <ImagePriorityInput/>
                <Row className="justify-content-end g-3 mb-1">
                    <Col xs="auto">
                        <Button type="submit" variant="primary" size="sm"
                                disabled={!productId || !value.image || status !== 'idle'}>
                            {status === 'saving' && (<Spinner size="sm" role="status" aria-hidden="true"/>)}
                            Save
                        </Button>
                    </Col>
                    <Col xs="auto">
                        <Button type="button" variant="outline-secondary" size="sm" onClick={reset}>
                            Reset
                        </Button>
                    </Col>
                    <Col xs="auto">
                        <Button type="button" variant="outline-secondary" size="sm" onClick={newImageHandler}>
                            New Image
                        </Button>
                    </Col>
                    <Col xs="auto">
                        <Button type="button" variant="outline-danger" size="sm" onClick={deleteImageHandler}
                                disabled={!productId || !value.id || status !== 'idle'}>
                            {status === 'deleting' && (<Spinner size="sm" role="status" aria-hidden="true"/>)}
                            Delete
                        </Button>

                    </Col>
                </Row>
                <Collapse in={changed}>
                    <div>
                        <Alert variant="warning">Don't forget to save your changes.</Alert>
                    </div>
                </Collapse>
            </Col>
            <Col lg="auto" className="d-none d-lg-block">
                <ProductImage filename={value.image || 'missing.png'}
                              className={classNames({'text-danger': !value.status})}
                              itemCode={value.altText} size={250}/>
            </Col>
        </Row>
    )
}

export default ProductImageEdit;
