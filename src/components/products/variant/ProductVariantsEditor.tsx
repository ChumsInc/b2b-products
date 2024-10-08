import React, {ChangeEvent, FormEvent, useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {Alert, FormCheck, FormColumn, InputGroup, SpinnerButton} from "chums-components";
import {selectCurrentProductVariants, selectCurrentVariant, selectCurrentVariantSaving} from "../../../ducks/products/variant/selectors";
import {ProductVariant} from "b2b-types/src/products";
import {Editable, Keyword} from "b2b-types";
import KeywordSelectInputGroup from "../../keywords/KeywordSelectInputGroup";
import {defaultVariant} from "../../../defaults";
import {loadProduct} from "../../../ducks/products/product/actions";
import {removeVariant, saveCurrentVariant, setDefaultVariant} from "../../../ducks/products/variant/actions";
import {selectCurrentProductId} from "../../../ducks/products/product/selectors";
import {useAppDispatch} from "../../app/hooks";
import {JSONView} from "@chumsinc/json-view";
import ProductImage from "./ProductImage";
import {Collapse} from "@mui/material";


const colWidth = 9;
const ProductVariantsEditor = () => {
    const dispatch = useAppDispatch();
    const productId = useSelector(selectCurrentProductId);
    const current = useSelector(selectCurrentVariant);
    const saving = useSelector(selectCurrentVariantSaving);
    const currentVariants = useSelector(selectCurrentProductVariants);
    const [variant, setVariant] = useState<ProductVariant & Editable>(current ?? {...defaultVariant});
    const [alert, setAlert] = useState<string|null>(null);

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

    const onEditVariantProduct = async () => {
        if (variant.product?.keyword) {
            await dispatch(loadProduct(variant.product.keyword));
        }
    }

    return (
        <div className="row g-3">
            <div className="col-md-8 col-12">
                <form onSubmit={submitHandler}>
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
                        <Collapse in={!!alert}>
                            <Alert color="danger">{alert}</Alert>
                        </Collapse>
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
                                       disabled={!!alert || !productId}
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
                        {variant.changed && <Alert color="warning">Don&#39;t forget to save your changes.</Alert>}
                    </FormColumn>
                </form>
            </div>
            <div className="col-md-4 col-12">
                <ProductImage imageUrl={variant.product?.image} defaultColor={variant.product?.defaultColor} size="400"/>
            </div>
        </div>
    )
}

export default ProductVariantsEditor;
