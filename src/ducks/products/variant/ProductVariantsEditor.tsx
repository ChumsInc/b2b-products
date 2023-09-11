import React, {ChangeEvent, FormEvent, useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {Alert, FormCheck, FormColumn, InputGroup, SpinnerButton} from "chums-components";
import {selectCurrentVariant, selectCurrentVariantSaving} from "./selectors";
import {ProductVariant} from "b2b-types/src/products";
import {Editable, Keyword} from "b2b-types";
import KeywordSelectInputGroup from "../../keywords/KeywordSelectInputGroup";
import {defaultVariant} from "../../../defaults";
import {loadProduct} from "../product/actions";
import {removeVariant, saveCurrentVariant, setDefaultVariant} from "./actions";
import {selectCurrentProductId} from "../product/selectors";
import {useAppDispatch} from "../../../app/hooks";
import {JSONView} from "@chumsinc/json-view";


const colWidth = 9;
const ProductVariantsEditor = () => {
    const dispatch = useAppDispatch();
    const productId = useSelector(selectCurrentProductId);
    const current = useSelector(selectCurrentVariant);
    const saving = useSelector(selectCurrentVariantSaving);
    const [variant, setVariant] = useState<ProductVariant & Editable>(current ?? {...defaultVariant});

    useEffect(() => {
        if (!variant?.id || variant?.parentProductID !== productId) {
            const variant: ProductVariant = {...defaultVariant, parentProductID: productId};
            console.log('useEffect()', productId, variant);
            setVariant(variant);
        }
    }, [productId]);

    useEffect(() => {

        setVariant(current ? {...current} : {...defaultVariant, parentProductID: productId});
    }, [current?.id, current?.timestamp]);

    const submitHandler = (ev: FormEvent) => {
        ev.preventDefault();
        dispatch(saveCurrentVariant(variant));
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
        setVariant({...variant, variantProductID: kw?.id ?? 0});
    }

    const newVariantHandler = () => {
        if (!productId) {
            return;
        }
        if (!variant.changed || window.confirm('Are you sure you want to discard your changes?')) {
            setVariant({...defaultVariant, parentProductID: productId});
        }
    }

    const deleteVariantHandler = () => {
        if (!current) {
            return;
        }
        if (window.confirm('Are you sure you want to delete this variant?')) {
            dispatch(removeVariant(current));
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

    const onEditVariantProduct = () => {
        if (variant.product?.keyword) {
            dispatch(loadProduct(variant.product.keyword));
        }
    }

    return (
        <>
            <form onSubmit={submitHandler} className="mt-3">
                <FormColumn label="ID" width={colWidth}>
                    <InputGroup bsSize="sm">
                        <input type="number" readOnly value={variant.id} className="form-control form-control-sm"/>
                    </InputGroup>
                </FormColumn>
                <FormColumn label="Child" width={colWidth}>
                    <KeywordSelectInputGroup pageType="product" value={variant.variantProductID}
                                             required
                                             onSelectKeyword={keywordChangeHandler}>

                        <button type="button" className="btn btn-sm btn-secondary" onClick={onEditVariantProduct}
                                disabled={variant.id === 0 || !variant.product}>
                            <span className="bi-pencil-fill"/>
                        </button>
                    </KeywordSelectInputGroup>
                </FormColumn>
                <FormColumn label="Name" width={colWidth}>
                    <input type="text" className="form-control form-control-sm"
                           value={variant.title} onChange={changeHandler('title')} required/>
                </FormColumn>
                <FormColumn label="Status" width={colWidth} align="baseline">
                    <FormCheck label='Enabled' checked={variant.status} onChange={changeHandler('status')}
                               disabled={!variant.product?.status}
                               type="checkbox" inline/>
                </FormColumn>

                <FormColumn label="" width={colWidth}>
                    <SpinnerButton type="submit" className="btn btn-sm btn-primary me-2 mb-1"
                                   spinning={saving}>Save</SpinnerButton>
                    <button type="button" className="btn btn-sm btn-outline-secondary me-2 mb-1"
                            onClick={newVariantHandler}
                            disabled={!productId}>
                        New
                    </button>
                    <button type="button" className="btn btn-sm btn-outline-danger me-2 mb-1"
                            onClick={deleteVariantHandler}
                            disabled={!productId}>
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
            <JSONView data={variant}/>
        </>
    )
}

export default ProductVariantsEditor;
