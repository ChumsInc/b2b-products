import React, {ChangeEvent, FormEvent, useState} from 'react';
import {useSelector} from "react-redux";
import {Alert, FormColumn, SpinnerButton} from "chums-components";
import {selectCurrentProduct, selectCurrentProductSaving} from "./selectors";
import {Product, ProductAdditionalData} from "b2b-types/src/products";
import TextareaAutosize from 'react-textarea-autosize';
import ModalEditor from "../../../app/ModalEditor";
import {saveProduct, updateProduct, updateProductAdditionalData} from "./actions";
import {useAppDispatch} from "../../../app/hooks";
import CodeEditButton from "./CodeEditButton";


const colWidth = 8;
const ProductDetailsTab: React.FC = () => {
    const dispatch = useAppDispatch();
    const product = useSelector(selectCurrentProduct);
    const saving = useSelector(selectCurrentProductSaving);

    const [showEditor, setShowEditor] = useState(false);
    const [editorField, setEditorField] = useState<'details' | 'description'>('details');

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

    const onShowEditor = (field: 'details' | 'description') => {
        setEditorField(field)
        setShowEditor(true);
    }
    const onCloseEditor = (value: string) => {
        dispatch(updateProduct({[editorField]: value}));
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
            <form onSubmit={submitHandler} className="mt-3">
                <FormColumn label="Formatted Name" width={colWidth}>
                    <TextareaAutosize className="form-control form-control-sm font-monospace mb-1" minRows={2}
                                      value={product.additionalData?.formatted_name || ''}
                                      onChange={additionalDataChangeHandler('formatted_name')}/>
                </FormColumn>
                <FormColumn label="Subtitle" width={colWidth}>
                    <input type="text" className="form-control form-control-sm"
                           value={product.additionalData?.subtitle || ''}
                           onChange={additionalDataChangeHandler('subtitle')}/>
                </FormColumn>
                <FormColumn label="Size" width={colWidth}>
                    <input type="text" className="form-control form-control-sm"
                           value={product.additionalData?.size || ''} onChange={additionalDataChangeHandler('size')}
                           list="product--additional-data--size"/>
                    <datalist id="product--additional-data--size">
                        <option value="XS">XS</option>
                        <option value="SM">SM</option>
                        <option value="MD">MD</option>
                        <option value="LG">LG</option>
                        <option value="XL">XL</option>
                        <option value="XXL">XXL</option>
                    </datalist>
                </FormColumn>
                <FormColumn
                    label={<CodeEditButton onClick={() => onShowEditor('description')}>Description</CodeEditButton>}
                    width={colWidth}>
                    <TextareaAutosize className="form-control form-control-sm font-monospace mb-1" minRows={2}
                                      value={product.description} onChange={textChangeHandler('description')}/>
                </FormColumn>
                <FormColumn label={<CodeEditButton onClick={() => onShowEditor('details')}>Details</CodeEditButton>}
                            width={colWidth}>
                    <TextareaAutosize className="form-control form-control-sm font-monospace mb-1" minRows={2}
                                      value={product.details} onChange={textChangeHandler('details')}/>
                </FormColumn>
                <FormColumn label="Anticipated Price" width={colWidth}>
                    <input type="text" className="form-control form-control-sm"
                           value={product.anticipatedPrice || 0}
                           onChange={additionalDataChangeHandler('subtitle')}/>
                </FormColumn>
                <FormColumn label="" width={colWidth}>
                    <SpinnerButton type="submit" className="btn btn-sm btn-primary me-1"
                                   spinning={saving}>Save</SpinnerButton>
                </FormColumn>
                <FormColumn label="" width={colWidth}>
                    {product.changed && <Alert color="warning">Don't forget to save your changes.</Alert>}
                </FormColumn>
            </form>
            {showEditor &&
                <ModalEditor title={`edit product.${editorField}`} content={String(product[editorField]) || ''}
                             onClose={onCloseEditor} onCancel={onCancelEditor}/>
            }
        </>
    )
}

export default ProductDetailsTab;
