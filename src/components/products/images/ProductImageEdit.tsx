import React, {ChangeEvent, FormEvent, useEffect, useRef, useState} from "react";
import {useAppDispatch} from "../../app/hooks";
import {useSelector} from "react-redux";
import {
    removeImage,
    saveImage,
    setCurrentImage
} from "../../../ducks/products/images/actions";
import {Editable, ProductAlternateImage} from "b2b-types";
import {selectCurrentProductId} from "../../../ducks/products/product/selectors";
import classNames from "classnames";
import ProductImage from "../../app/ProductImage";
import {Alert, FormCheck, FormColumn, SpinnerButton} from "chums-components";
import {selectCurrentImage, selectImagesStatus} from "../../../ducks/products/images/selectors";

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
    const productId = useSelector(selectCurrentProductId);
    const current = useSelector(selectCurrentImage);
    const status = useSelector(selectImagesStatus);
    const [image, setImage] = useState<ProductAlternateImage & Editable>(current ?? {...newImage, productId});
    const filenameRef = useRef<HTMLInputElement | null>(null);

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
        <form onSubmit={submitHandler} className="row g-3">
            <div className="col-lg-6 col-12">
                <FormColumn label="ID">
                    <input type="text" value={image.id ?? 0} readOnly disabled
                           className="form-control form-control-sm"/>
                </FormColumn>
                <FormColumn label="File Name">
                    <input type="text" value={image.image} onChange={changeHandler('image')}
                           ref={filenameRef}
                           className="form-control form-control-sm"/>
                </FormColumn>
                <FormColumn label="Alt Text">
                    <input type="text" value={image.altText} onChange={changeHandler('altText')}
                           className="form-control form-control-sm"/>
                    <small className="text-muted">Use #SKU to show for only that SKU</small>
                </FormColumn>
                <FormColumn label="Active">
                    <FormCheck type="checkbox" label="Active" checked={!!image.status}
                               onChange={changeHandler('status')}/>
                </FormColumn>
                <FormColumn label="Priority">
                    <input type="number" value={image.priority} onChange={changeHandler('priority')}
                           className="form-control form-control-sm text-end"/>
                </FormColumn>
                <hr/>
                <div className="d-flex justify-content-between">
                    <SpinnerButton type="submit" color="primary" size="sm" spinning={status === 'saving'}
                                   disabled={!productId || !image.image || status !== 'idle'}>
                        Save
                    </SpinnerButton>
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={newImageHandler}>
                        New Image
                    </button>
                    <SpinnerButton type="button" size="sm" color="danger" spinning={status === 'deleting'}
                                   onClick={deleteImageHandler}
                                   disabled={!productId || !image.id || status !== 'idle'}>
                        Delete
                    </SpinnerButton>
                </div>
                {image.changed && (
                    <Alert color="warning">Don't forget to save your changes.</Alert>
                )}
            </div>
            <div className="col-lg-6 d-none d-lg-block">
                {current?.image && (
                    <ProductImage filename={current.image}
                                  className={classNames({'text-danger': !current.status})}
                                  itemCode={current.altText} size={250}/>
                )}
            </div>

        </form>
    )
}

export default ProductImageEdit;
