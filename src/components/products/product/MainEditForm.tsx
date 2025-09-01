import React, {ChangeEvent, FormEvent, useId} from 'react';
import {useSelector} from "react-redux";
import {selectCurrentProduct, selectCurrentProductSaving} from "@/ducks/products/product/selectors";
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
} from "@/ducks/products/product/actions";
import {useAppDispatch} from "../../app/hooks";
import {generatePath, useMatch, useNavigate} from "react-router";
import SpinnerButton from "../../common/SpinnerButton";
import {Alert, Button, Col, Form, FormCheck, FormControl, Row} from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import ProductPreviewLink from "@/components/products/product/ProductPreviewLink";
import {ErrorBoundary} from "react-error-boundary";
import ErrorFallbackComponent from "@/components/app/ErrorFallbackComponent";


const colWidth = 8;
const MainEditForm = () => {
    const dispatch = useAppDispatch();
    const match = useMatch('/products/:keyword');
    const product = useSelector(selectCurrentProduct);
    const saving = useSelector(selectCurrentProductSaving);
    const navigate = useNavigate();
    const idProductId = useId();
    const keywordId = useId();
    const titleId = useId();
    const enabledId = useId();
    const availableId = useId();
    const seasonId = useId();
    const seasonAvailableId = useId();
    const availabilityId = useId();
    const categoryId = useId();
    const parentId = useId();
    const itemCodeId = useId();
    const productNameId = useId();
    const imageId = useId();
    const colorId = useId();
    const swatchId = useId();
    const bestSellerId = useId();
    const upcycledId = useId();
    const canDomeId = useId();
    const canScreenPrintId = useId();
    const heatTransferId = useId();
    const sublimationId = useId();
    const rfidBlockingId = useId();


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
        <ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
            <Form onSubmit={submitHandler} className="mt-3">
                <Form.Group as={Row}>
                    <Form.Label column={true} xs={4} lg={3} htmlFor={idProductId}>ID</Form.Label>
                    <Col>
                        <InputGroup size="sm">
                            <FormControl type="number" size="sm" disabled readOnly value={product.id}
                                         id={idProductId}/>
                            <Button type="button" size="sm" variant="outline-secondary" onClick={duplicateHandler}
                                    disabled={!product.id}>
                                Duplicate Product
                            </Button>
                        </InputGroup>
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column={true} xs={4} lg={3} htmlFor={keywordId}>Keyword</Form.Label>
                    <Col>
                        <InputGroup size="sm">
                            <FormControl type="text" id={keywordId} size="sm"
                                         value={product.keyword} onChange={textChangeHandler('keyword')} required/>
                            {!!product.id && (
                                <InputGroup.Text as={ProductPreviewLink} product={product} />
                            )}
                        </InputGroup>
                        {product.keyword.toLowerCase() === 'new' && (
                            <div className="form-text text-danger">
                                Keyword &#39;new&#39; is not allowed!
                            </div>
                        )}
                    </Col>
                </Form.Group>
                <Form.Group as={Row} label="Title" width={colWidth}>
                    <Form.Label column={true} xs={4} lg={3} htmlFor={titleId}>Title</Form.Label>
                    <Col>
                        <FormControl type="text" size="sm" id={titleId}
                                     value={product.name || ''}
                                     onChange={textChangeHandler('name')}/>
                    </Col>
                </Form.Group>
                <hr/>
                <Form.Group as={Row} label="Status" width={colWidth} align="baseline">
                    <Form.Label column={true} xs={4} lg={3}>Status</Form.Label>
                    <Col>
                        <FormCheck label='Enabled' id={enabledId}
                                   checked={product.status} onChange={toggleChangeHandler('status')}
                                   type="checkbox" inline/>
                        <FormCheck label='Available for Sale' id={availableId}
                                   checked={product.availableForSale}
                                   onChange={toggleChangeHandler('availableForSale')} type="checkbox" inline/>
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column={true} xs={4} lg={3} htmlFor={seasonId}>Season</Form.Label>
                    <Col>
                        <InputGroup size="sm">
                            <InputGroup.Text as="label" htmlFor={seasonId}>Season</InputGroup.Text>
                            <SeasonSelect value={product.season?.code || ''} id={seasonId}
                                          onChange={seasonChangeHandler}/>
                            <InputGroup.Text as="label" htmlFor={seasonAvailableId}>Season Available</InputGroup.Text>
                            <InputGroup.Checkbox id={seasonAvailableId} type="checkbox"
                                                 checked={product.additionalData?.seasonAvailable ?? false}
                                                 onChange={toggleAdditionalDataChangeHandler('seasonAvailable')}
                            />
                        </InputGroup>
                    </Col>
                    {product.season?.code && <SeasonAlert code={product.season.code}/>}
                </Form.Group>
                <Form.Group as={Row} label="Availability" width={colWidth}>
                    <Form.Label column={true} xs={4} lg={3} htmlFor={availabilityId}>Availability</Form.Label>
                    <Col>
                        <FormControl type="text" size="sm" id={availabilityId}
                                     placeholder="Availability Message"
                                     value={product.dateAvailable} onChange={textChangeHandler('dateAvailable')}/>
                    </Col>
                </Form.Group>

                <hr/>
                <Form.Group as={Row}>
                    <Form.Label column={true} xs={4} lg={3} htmlFor={categoryId}>Category</Form.Label>
                    <Col>
                        <KeywordSelectInputGroup pageType="category" id={categoryId}
                                                 value={product.defaultCategoriesId} required
                                                 onSelectKeyword={keywordChangeHandler('defaultCategoriesId')}/>
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column={true} xs={4} lg={3} htmlFor={parentId}>Parent</Form.Label>
                    <Col>
                        <KeywordSelectInputGroup pageType="product" id={parentId}
                                                 value={product.defaultParentProductsId}
                                                 required={product.redirectToParent}
                                                 onSelectKeyword={keywordChangeHandler('defaultParentProductsId')}>
                            <RedirectToParent/>
                        </KeywordSelectInputGroup>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} label="Sell As" width={colWidth}>
                    <Form.Label column={true} xs={4} lg={3}>Sell As</Form.Label>
                    <Col>
                        <ProductSellAsToggle/>
                    </Col>
                </Form.Group>

                <hr/>

                <Form.Group as={Row}>
                    <Form.Label column={true} xs={4} lg={3} htmlFor={itemCodeId}>Item Code</Form.Label>
                    <Col>
                        <ProductItemCodeInput id={itemCodeId}/>
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column={true} xs={4} lg={3} htmlFor={productNameId}>Name</Form.Label>
                    <Col>
                        <FormControl type="text" size="sm" id={productNameId}
                                     value={product.name} onChange={textChangeHandler('name')}
                                     required/>
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column={true} xs={4} lg={3} htmlFor={imageId}>Image</Form.Label>
                    <Col>
                        <FormControl type="text" size="sm" id={imageId}
                                     value={product.image} onChange={textChangeHandler('image')} required/>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} label="Default Color" width={colWidth}>
                    <Form.Label column={true} xs={4} lg={3} htmlFor={colorId}>Default Color</Form.Label>
                    <Col>
                        <InputGroup size="sm">
                            <FormControl type="text" size="sm" id={colorId}
                                         value={product.defaultColor} onChange={textChangeHandler('defaultColor')}/>
                            <InputGroup.Text as="label" htmlFor={swatchId}>Swatch</InputGroup.Text>
                            <FormControl type="text" size="sm" id={swatchId}
                                         value={product.additionalData?.swatch_format ?? ''}
                                         onChange={additionalDataChangeHandler('swatch_format')}/>
                        </InputGroup>
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Form.Label column={true} xs={4} lg={3}>Features</Form.Label>
                    <Col>
                        <FormCheck label="Best Seller" type="checkbox" inline id={bestSellerId}
                                   checked={product.additionalData?.best_seller || false}
                                   onChange={toggleAdditionalDataChangeHandler('best_seller')}/>
                        <FormCheck label="Upcycled" type="checkbox" inline id={upcycledId}
                                   checked={product.additionalData?.upcycled || false}
                                   onChange={toggleAdditionalDataChangeHandler('upcycled')}/>
                        <FormCheck label="Dome" type="checkbox" inline id={canDomeId}
                                   checked={product.canDome || false}
                                   onChange={toggleChangeHandler('canDome')}/>
                        <FormCheck label="Screen Print" type="checkbox" inline id={canScreenPrintId}
                                   checked={product.canScreenPrint || false}
                                   onChange={toggleChangeHandler('canScreenPrint')}/>
                        <FormCheck label="Heat Transfer" type="checkbox" inline id={heatTransferId}
                                   checked={product.additionalData?.heatTransfer || false}
                                   onChange={toggleAdditionalDataChangeHandler('heatTransfer')}/>
                        <FormCheck label="Sublimation" inline type="checkbox" id={sublimationId}
                                   checked={product.additionalData?.sublimation || false}
                                   onChange={toggleAdditionalDataChangeHandler('sublimation')}/>
                        <FormCheck label="RFID-Blocking" inline type="checkbox" id={rfidBlockingId}
                                   checked={product.additionalData?.rfidBlocking || false}
                                   onChange={toggleAdditionalDataChangeHandler('rfidBlocking')}/>
                    </Col>
                </Form.Group>
                <hr/>
                <Row className="justify-content-end">
                    <Col xs="auto">
                        <SpinnerButton type="submit" variant="primary" size="sm" spinning={saving}>Save</SpinnerButton>
                    </Col>
                    <Col xs="auto">
                        <Button type="button" variant="outline-secondary" size="sm"
                                onClick={newProductHandler}>
                            New Product
                        </Button>

                    </Col>
                    <Col xs="auto">
                        <Button type="button" variant="outline-secondary" size="sm"
                                disabled={!product.keyword || !product.id} onClick={reloadHandler}>
                            Reload
                        </Button>
                    </Col>
                </Row>
                {product.changed && <Alert variant="warning">Don&#39;t forget to save your changes.</Alert>}
            </Form>
        </ErrorBoundary>
    )
}

export default MainEditForm;
