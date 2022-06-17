import React, {ChangeEvent, FormEvent, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Alert, FormCheck, FormColumn, InputGroup, SpinnerButton} from "chums-ducks";
import {selectCurrentProduct, selectCurrentProductLoading, selectCurrentProductSaving} from "../selectors";
import {Product, ProductAdditionalData} from "b2b-types/src/products";
import {
    duplicateProductAction, loadProductAction,
    saveProductAction,
    setNewCurrentProductAction,
    updateProductAction,
    updateProductAdditionalDataAction
} from "../actions";
import SeasonSelect from "../../seasons/SeasonSelect";
import {Keyword, ProductSeason} from "b2b-types";
import KeywordSelect from "../../keywords/KeywordSelect";
import ProductSellAsToggle from "./ProductSellAsToggle";
import ProductItemCodeInput from "./ProductItemCodeInput";
import SeasonAlert from "../../seasons/SeasonAlert";
import TextareaAutosize from 'react-textarea-autosize';
import ModalEditor from "../../../app/ModalEditor";
import CodeEditButton from "./CodeEditButton";
import RedirectToParent from "./RedirectToParent";


const colWidth = 8;
const ProductDetailsTab: React.FC = () => {
    const dispatch = useDispatch();
    const product = useSelector(selectCurrentProduct);
    const loading = useSelector(selectCurrentProductLoading);
    const saving = useSelector(selectCurrentProductSaving);

    const [showEditor, setShowEditor] = useState(false);
    const [editorField, setEditorField] = useState<'details' | 'description'>('details');

    const submitHandler = (ev: FormEvent) => {
        ev.preventDefault();
        dispatch(saveProductAction());
    }

    const textChangeHandler = (field: keyof Product) => (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        switch (field) {
        case 'description':
        case 'details':
            return dispatch(updateProductAction({[field]: ev.target.value}));
        }
    }
    const additionalDataChangeHandler = (field: keyof ProductAdditionalData) =>
        (ev: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {

        switch (field) {
        case 'subtitle':
        case 'size':
        case 'formatted_name':
        case 'swatch_format':
            return dispatch(updateProductAdditionalDataAction({[field]: ev.target.value}));
        }
    }

    const toggleChangeHandler = (field: keyof Product) => () => {
        switch (field) {
        case 'canDome':
        case 'canScreenPrint':
            return dispatch(updateProductAction({[field]: !product[field]}));
        }
    }

    const toggleAdditionalDataChangeHandler = (field: keyof ProductAdditionalData) => () => {
        const checked = (!!product.additionalData ? !!product.additionalData[field] : false);
        switch (field) {
        case 'best_seller':
        case 'upcycled':
            return dispatch(updateProductAdditionalDataAction({[field]: !checked}));
        }
    }

    const onShowEditor = (field: 'details' | 'description') => {
        setEditorField(field)
        setShowEditor(true);
    }
    const onCloseEditor = (value: string) => {
        dispatch(updateProductAction({[editorField]: value}));
        setShowEditor(false);
    }

    const onCancelEditor = () => {
        setShowEditor(false);
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
