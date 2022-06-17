import React, {ChangeEvent, FormEvent, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Alert, FormCheck, FormColumn, InputGroup, SpinnerButton} from "chums-ducks";
import {
    selectCurrentProduct,
    selectCurrentVariant,
    selectCurrentVariantLoading,
    selectCurrentVariantSaving
} from "../selectors";
import {Product, ProductVariant} from "b2b-types/src/products";
import {
    deleteVariantAction, loadProductAction,
    saveCurrentVariantAction,
    setCurrentVariantAction,
    setDefaultVariantAction,
    updateVariantAction
} from "../actions";
import {Keyword} from "b2b-types";
import KeywordSelect from "../../keywords/KeywordSelect";
import {defaultVariant} from "../../../defaults";



const colWidth = 9;
const ProductVariantsEditor: React.FC = () => {
    const dispatch = useDispatch();
    const {id} = useSelector(selectCurrentProduct);
    const variant = useSelector(selectCurrentVariant);
    const loading = useSelector(selectCurrentVariantLoading);
    const saving = useSelector(selectCurrentVariantSaving);

    useEffect(() => {
        if (!variant.id || variant.parentProductID !== id) {
            dispatch(setCurrentVariantAction({...defaultVariant, parentProductID: id}));
        }
    }, [id])

    const submitHandler = (ev: FormEvent) => {
        ev.preventDefault();
        dispatch(saveCurrentVariantAction());
    }

    const textChangeHandler = (field: keyof ProductVariant) => (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        switch (field) {
        case 'title':
            return dispatch(updateVariantAction({[field]: ev.target.value}));
        }
    }

    const keywordChangeHandler = (field: keyof ProductVariant) => (kw: Keyword | null) => {
        switch (field) {
        case 'variantProductID':
            return dispatch(updateVariantAction({[field]: kw?.id || 0}))
        }
    }

    const toggleChangeHandler = (field: keyof ProductVariant) => () => {
        switch (field) {
        case 'status':
            return dispatch(updateVariantAction({[field]: !variant[field]}));
        }
    }


    const newVariantHandler = () => {
        if (!variant.changed || window.confirm('Are you sure you want to discard your changes?')) {
            dispatch(setCurrentVariantAction({...defaultVariant, parentProductID: id}));
        }
    }

    const deleteVariantHandler = () => {
        if (window.confirm('Are you sure you want to delete this variant?')) {
            dispatch(deleteVariantAction());
        }
    }

    const defaultVariantHandler = () => {
        if (window.confirm('Are you sure you want to make this the default variant?')) {
            dispatch(setDefaultVariantAction());
        }
    }

    const onEditVariantProduct = () => dispatch(loadProductAction(variant.product?.keyword || ''));

    return (
        <>
            <form onSubmit={submitHandler} className="mt-3">
                <FormColumn label="ID" width={colWidth}>
                    <InputGroup bsSize="sm">
                        <input type="number" readOnly value={variant.id} className="form-control form-control-sm"/>
                    </InputGroup>
                </FormColumn>
                <FormColumn label="Child" width={colWidth}>
                    <KeywordSelect pageType="product" value={variant.variantProductID}
                                   required
                                   onSelectKeyword={keywordChangeHandler('variantProductID')}>

                        <button className="btn btn-sm btn-secondary" onClick={onEditVariantProduct}>
                            <span className="bi-pencil-fill" />
                        </button>
                    </KeywordSelect>
                </FormColumn>
                <FormColumn label="Name" width={colWidth}>
                    <input type="text" className="form-control form-control-sm"
                           value={variant.title} onChange={textChangeHandler('title')} required/>
                </FormColumn>
                <FormColumn label="Status" width={colWidth} align="baseline">
                    <FormCheck label='Enabled' checked={variant.status} onClick={toggleChangeHandler('status')}
                               disabled={!variant.product?.status}
                               type="checkbox" inline/>
                </FormColumn>

                <FormColumn label="" width={colWidth}>
                    <SpinnerButton type="submit" className="btn btn-sm btn-primary me-2 mb-1"
                                   spinning={saving}>Save</SpinnerButton>
                    <button type="button" className="btn btn-sm btn-outline-secondary me-2 mb-1" onClick={newVariantHandler}
                            disabled={!id}>
                        New
                    </button>
                    <button type="button" className="btn btn-sm btn-outline-danger me-2 mb-1" onClick={deleteVariantHandler}
                            disabled={!id}>
                        Delete
                    </button>
                    <button type="button" className="btn btn-sm btn-outline-info me-2 mb-1"
                            onClick={defaultVariantHandler}
                            disabled={variant.isDefaultVariant || !variant.id}>
                        {variant.isDefaultVariant && <>Default Variant</>}
                        {!variant.isDefaultVariant && <>Set Default Variant</>}
                    </button>
                </FormColumn>
                <FormColumn label="" width={colWidth} className="mt-1">

                </FormColumn>
                <FormColumn label="" width={colWidth}>
                    {variant.changed && <Alert color="warning">Don't forget to save your changes.</Alert>}
                </FormColumn>
            </form>
        </>
    )
}

export default ProductVariantsEditor;
