import React, {ChangeEvent, FormEvent} from 'react';
import {useSelector} from "react-redux";
import {Alert, FormCheck, FormColumn, InputGroup, SpinnerButton} from "chums-components";
import {selectCurrentProduct, selectCurrentProductSaving} from "../../../ducks/products/product/selectors";
import {Product, ProductAdditionalData} from "b2b-types/src/products";
import SeasonSelect from "../../season/SeasonSelect";
import {Keyword, ProductSeason} from "b2b-types";
import KeywordSelectInputGroup from "../../keywords/KeywordSelectInputGroup";
import ProductSellAsToggle from "./ProductSellAsToggle";
import ProductItemCodeInput from "./ProductItemCodeInput";
import SeasonAlert from "../../season/SeasonAlert";
import RedirectToParent from "./RedirectToParent";
import {
    duplicateProduct,
    loadProduct,
    saveProduct,
    updateProduct,
    updateProductAdditionalData,
    updateProductSeason
} from "../../../ducks/products/product/actions";
import {useAppDispatch} from "../../app/hooks";
import {useMatch, useNavigate} from "react-router";
import {generatePath} from "react-router-dom";


const colWidth = 8;
const MainEditForm = () => {
    const dispatch = useAppDispatch();
    const match = useMatch('/products/:keyword');
    const product = useSelector(selectCurrentProduct);
    const saving = useSelector(selectCurrentProductSaving);
    const navigate = useNavigate();


    const submitHandler = async (ev: FormEvent) => {
        ev.preventDefault();
        if (!product) {
            return;
        }
        const res = await dispatch(saveProduct(product));
        console.debug('submitHandler', res.meta.arg.keyword, match?.params.keyword);
        if (match?.params.keyword !== res.meta.arg.keyword) {
            navigate(generatePath('/products/:keyword', {keyword: res.meta.arg.keyword}));
        }
    }

    const textChangeHandler = (field: keyof Product) => (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        switch (field) {
            case 'keyword':
            case 'dateAvailable':
            case 'itemCode':
            case 'name':
            case 'image':
            case 'defaultColor':
            case 'description':
            case 'details':
                return dispatch(updateProduct({[field]: ev.target.value}));
        }
    }
    const additionalDataChangeHandler = (field: keyof ProductAdditionalData) => (ev: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

        switch (field) {
            case 'subtitle':
            case 'size':
            case 'formatted_name':
            case 'swatch_format':
                return dispatch(updateProductAdditionalData({[field]: ev.target.value}));
        }
    }

    const keywordChangeHandler = (field: keyof Product) => (kw: Keyword | null) => {
        switch (field) {
            case 'defaultCategoriesId':
            case "defaultParentProductsId":
                return dispatch(updateProduct({[field]: kw?.id || 0}))
        }
    }

    const toggleChangeHandler = (field: keyof Product) => () => {
        if (!product) {
            return;
        }
        switch (field) {
            case 'status':
            case 'availableForSale':
            case 'canDome':
            case 'canScreenPrint':
                return dispatch(updateProduct({[field]: !product[field]}));
        }
    }

    const toggleAdditionalDataChangeHandler = (field: keyof ProductAdditionalData) => () => {
        if (!product) {
            return;
        }
        const checked = (product.additionalData ? !!product.additionalData[field] : false);
        switch (field) {
            case 'best_seller':
            case 'upcycled':
            case 'seasonAvailable':
            case 'heatTransfer':
            case 'sublimation':
            case 'rfidBlocking':
                return dispatch(updateProductAdditionalData({[field]: !checked}));
        }
    }

    const seasonChangeHandler = (season: ProductSeason | null) => {
        dispatch(updateProductSeason(season));
    }


    const duplicateHandler = () => {
        if (!product) {
            return;
        }
        if (!product.changed || window.confirm('Are you sure you want to lose your changes?')) {
            dispatch(duplicateProduct());
        }
    }

    const newProductHandler = () => {
        if (!product) {
            return;
        }

        if (!product.changed || window.confirm('Are you sure you want to discard your changes?')) {
            navigate('/products/new');
            // dispatch(setNewProduct());
        }
    }
    const reloadHandler = () => {
        if (!product) {
            return;
        }

        if (!product.changed || window.confirm('Are you sure you want to discard your changes?')) {
            dispatch(loadProduct(product.keyword));
        }
    }


    if (!product) {
        return null;
    }

    return (
        <>
            <form onSubmit={submitHandler} className="mt-3">
                <FormColumn label="ID" width={colWidth}>
                    <InputGroup bsSize="sm">
                        <input type="number" disabled readOnly value={product.id}
                               className="form-control form-control-sm"/>
                        <button type="button" className="btn btn-sm btn-warning" onClick={duplicateHandler}
                                disabled={!product.id}>
                            Duplicate
                        </button>
                    </InputGroup>
                </FormColumn>
                <FormColumn label="Keyword" width={colWidth}>
                    <InputGroup bsSize="sm">
                        <input type="text" className="form-control form-control-sm"
                               value={product.keyword} onChange={textChangeHandler('keyword')} required/>
                        {!!product.id && (
                            <a href={`https://b2b.chums.com/products/${product.keyword}`} target="b2b-preview"
                               className="input-group-text">
                                View Page <span className="ms-1 bi-link-45deg"/>
                            </a>

                        )}
                    </InputGroup>
                    {product.keyword.toLowerCase() === 'new' && (
                        <div className="form-text text-danger">
                            Keyword &#39;new&#39; is not allowed!
                        </div>
                    )}
                </FormColumn>
                <FormColumn label="Title" width={colWidth}>
                    <input type="text" className="form-control form-control-sm"
                           value={product.name || ''}
                           onChange={textChangeHandler('name')}/>
                </FormColumn>
                <hr/>
                <FormColumn label="Status" width={colWidth} align="baseline">
                    <FormCheck label='Enabled' checked={product.status} onChange={toggleChangeHandler('status')}
                               type="checkbox" inline/>
                    <FormCheck label='Available for Sale' checked={product.availableForSale}
                               onChange={toggleChangeHandler('availableForSale')} type="checkbox" inline/>
                </FormColumn>
                <FormColumn label="Product Season" width={colWidth}>
                    <InputGroup bsSize="sm">
                        <span className="input-group-text">Season</span>
                        <SeasonSelect value={product.season?.code || ''}
                                      onChange={seasonChangeHandler}/>
                        <div className="input-group-text">
                            <label className="form-check-label me-3"
                                   htmlFor="product-season-available">Available</label>
                            <input type="checkbox" id="product-season-available" className="form-check-input"
                                   checked={product.additionalData?.seasonAvailable ?? false}
                                   onChange={toggleAdditionalDataChangeHandler('seasonAvailable')}/>
                        </div>
                    </InputGroup>
                    {product.season?.code && <SeasonAlert code={product.season.code}/>}
                </FormColumn>
                <FormColumn label="Availability" width={colWidth}>
                    <input type="text" className="form-control form-control-sm" placeholder="Availability Message"
                           value={product.dateAvailable} onChange={textChangeHandler('dateAvailable')}/>
                </FormColumn>

                <hr/>
                <FormColumn label="Category" width={colWidth}>
                    <KeywordSelectInputGroup pageType="category" value={product.defaultCategoriesId} required
                                             onSelectKeyword={keywordChangeHandler('defaultCategoriesId')}/>
                </FormColumn>
                <FormColumn label="Parent" width={colWidth}>
                    <KeywordSelectInputGroup pageType="product" value={product.defaultParentProductsId}
                                             required={product.redirectToParent}
                                             onSelectKeyword={keywordChangeHandler('defaultParentProductsId')}>
                        <RedirectToParent/>
                    </KeywordSelectInputGroup>
                </FormColumn>
                <FormColumn label="Sell As" width={colWidth}>
                    <ProductSellAsToggle/>
                </FormColumn>

                <hr/>

                <FormColumn label="Item Code" width={colWidth}>
                    <ProductItemCodeInput/>
                </FormColumn>
                <FormColumn label="Name" width={colWidth}>
                    <input type="text" className="form-control form-control-sm"
                           value={product.name} onChange={textChangeHandler('name')} required/>
                </FormColumn>
                <FormColumn label="Image" width={colWidth}>
                    <input type="text" className="form-control form-control-sm"
                           value={product.image} onChange={textChangeHandler('image')} required/>
                </FormColumn>
                <FormColumn label="Default Color" width={colWidth}>
                    <InputGroup bsSize="sm">
                        <input type="text" className="form-control form-control-sm"
                               value={product.defaultColor} onChange={textChangeHandler('defaultColor')}/>
                        <div className="input-group-text">Swatch</div>
                        <input type="text" className="form-control form-control-sm"
                               value={product.additionalData?.swatch_format || ''}
                               onChange={additionalDataChangeHandler('swatch_format')}/>
                    </InputGroup>
                </FormColumn>
                <FormColumn label="Features" width={colWidth}>
                    <FormCheck label="Best Seller" inline checked={product.additionalData?.best_seller || false}
                               onChange={toggleAdditionalDataChangeHandler('best_seller')} type="checkbox"/>
                    <FormCheck label="Upcycled" inline checked={product.additionalData?.upcycled || false}
                               onChange={toggleAdditionalDataChangeHandler('upcycled')} type="checkbox"/>
                    <FormCheck label="Dome" inline checked={product.canDome || false}
                               onChange={toggleChangeHandler('canDome')} type="checkbox"/>
                    <FormCheck label="Screen Print" inline checked={product.canScreenPrint || false}
                               onChange={toggleChangeHandler('canScreenPrint')} type="checkbox"/>
                    <FormCheck label="Heat Transfer" inline checked={product.additionalData?.heatTransfer || false}
                               onChange={toggleAdditionalDataChangeHandler('heatTransfer')} type="checkbox"/>
                    <FormCheck label="Sublimation" inline checked={product.additionalData?.sublimation || false}
                               onChange={toggleAdditionalDataChangeHandler('sublimation')} type="checkbox"/>
                    <FormCheck label="RFID-Blocking" inline checked={product.additionalData?.rfidBlocking || false}
                               onChange={toggleAdditionalDataChangeHandler('rfidBlocking')} type="checkbox"/>
                </FormColumn>
                <hr/>
                <FormColumn label="" width={colWidth}>
                    <SpinnerButton type="submit" className="btn btn-sm btn-primary me-1"
                                   spinning={saving}>Save</SpinnerButton>
                    <button type="button" className="btn btn-sm btn-outline-secondary me-1"
                            onClick={newProductHandler}>
                        New Product
                    </button>
                    <button type="button" className="btn btn-sm btn-outline-secondary me-1"
                            disabled={!product.keyword || !product.id} onClick={reloadHandler}>
                        Reload
                    </button>
                </FormColumn>
                <FormColumn label="" width={colWidth}>
                    {product.changed && <Alert color="warning">Don&#39;t forget to save your changes.</Alert>}
                </FormColumn>
            </form>
        </>
    )
}

export default MainEditForm;
