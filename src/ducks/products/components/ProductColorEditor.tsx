import React, {ChangeEvent, FormEvent, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Alert, FormCheck, FormColumn, InputGroup, Modal, noop, SpinnerButton} from "chums-ducks";
import {
    selectCurrentColorItem, selectCurrentColorItemLoading, selectCurrentColorItemSaving,
    selectCurrentProduct,
    selectCurrentProductLoading,
    selectCurrentProductSaving
} from "../selectors";
import {
    Product,
    ProductAdditionalData, ProductColorItem,
    ProductColorItemAdditionalData,
    ProductColorVariant
} from "b2b-types/src/products";
import {
    deleteColorItemAction,
    duplicateProductAction, saveCurrentColorItemAction,
    saveProductAction, setCurrentColorItemAction, setNewCurrentProductAction, updateCurrentColorItemAction,
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
import {setCurrentColorItem, updateProductAdditionalData} from "../actionTypes";
import RedirectToParent from "./RedirectToParent";
import {updateCurrentColorAction} from "../../colors/actions";
import {defaultColorItem} from "../../../defaults";
import ColorDataList from "../../colors/ColorDataList";
import {selectColorByCode} from "../../colors/selectors";



const colWidth = 8;
const ProductColorEditor: React.FC = () => {
    const dispatch = useDispatch();
    const colorCodeRef = useRef<HTMLInputElement>(null)
    const {id: productId} = useSelector(selectCurrentProduct);
    const current = useSelector(selectCurrentColorItem);
    const loading = useSelector(selectCurrentColorItemLoading);
    const saving = useSelector(selectCurrentColorItemSaving);
    const color = useSelector(selectColorByCode(current.colorCode));

    useEffect(() => {
        dispatch(setCurrentColorItemAction({...defaultColorItem, productId}));
    }, [productId]);

    useEffect(() => {
        if (colorCodeRef.current) {
            colorCodeRef.current.focus();
        }
    }, [current.id])

    const submitHandler = (ev: FormEvent) => {
        ev.preventDefault();
        dispatch(saveCurrentColorItemAction());
    }

    const textChangeHandler = (field: keyof ProductColorItem) => (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        switch (field) {
        case 'itemCode':
        case 'colorCode':
            return dispatch(updateCurrentColorItemAction({[field]: ev.target.value}));
        }
    }

    const additionalDataChangeHandler = (field: keyof ProductColorItemAdditionalData) => (ev: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (field) {
        case 'swatch_code':
        case 'image_filename':
            const additionalData:ProductColorItemAdditionalData = current.additionalData || {};
            additionalData[field] = ev.target.value;
            return dispatch(updateCurrentColorItemAction({additionalData}));
        }
    }

    const toggleChangeHandler = (field: keyof ProductColorItem) => () => {
        switch (field) {
        case 'status':
            return dispatch(updateCurrentColorItemAction({[field]: !current[field]}));
        }
    }

    const seasonChangeHandler = (season: ProductSeason | null) => {
        const additionalData:ProductColorItemAdditionalData = {...(current.additionalData || {})};
        additionalData.season_id = season?.product_season_id || 0;
        additionalData.season = season || undefined;
        return dispatch(updateCurrentColorItemAction({additionalData}));
    }

    const newItemHandler = () => {
        if (!current.changed || window.confirm('Are you sure you want to discard your changes?')) {
            dispatch(setCurrentColorItemAction({...defaultColorItem, productId}));
        }
    }

    const deleteItemHandler = () => {
        if (window.confirm(`Are you sure you want to delete item ${current.itemCode}?`)) {
            dispatch(deleteColorItemAction());
        }
    }

    return (
        <>
            <form onSubmit={submitHandler} className="mt-3">
                <FormColumn label="ID" width={colWidth}>
                    <InputGroup bsSize="sm">
                        <input type="number" readOnly value={current.id} className="form-control form-control-sm"/>
                    </InputGroup>
                </FormColumn>
                <FormColumn label="Color Code" width={colWidth}>
                    <InputGroup bsSize="sm">
                        <input type="text" className="form-control form-control-sm"
                               ref={colorCodeRef}
                               list="product-color-item-list"
                               value={current.colorCode} onChange={textChangeHandler('colorCode')} required/>
                        <ColorDataList id='product-color-item-list'/>
                        <span className="input-group-text">{color?.name}</span>
                    </InputGroup>
                </FormColumn>
                <FormColumn label="Item Code" width={colWidth}>
                    <input type="text" className="form-control form-control-sm"
                           value={current.itemCode} onChange={textChangeHandler('itemCode')} required/>

                </FormColumn>
                <FormColumn label="Status" width={colWidth} align="baseline">
                    <FormCheck label='Enabled' checked={current.status} onClick={toggleChangeHandler('status')}
                               type="checkbox" inline/>
                    <FormCheck label='Inactive' checked={!!current.inactiveItem} onClick={noop} disabled
                               type="checkbox" inline/>
                    <FormCheck label='Disco' checked={current.productType === 'D'} onClick={noop} disabled
                               type="checkbox" inline/>
                    {current.productType === null && <Alert color="danger">Item <strong>{current.itemCode}</strong> does not exist.</Alert> }
                </FormColumn>
                <FormColumn label="Image" width={colWidth}>
                    <input type="text" className="form-control form-control-sm"
                           value={current.additionalData?.image_filename || ''} onChange={additionalDataChangeHandler('image_filename')}/>
                </FormColumn>
                <FormColumn label="Order Type" width={colWidth}>
                    <InputGroup bsSize="sm">
                        <span className="input-group-text">Season</span>
                        <SeasonSelect value={current.additionalData?.season?.code || ''} onlyActive={true}
                                      onChange={seasonChangeHandler}/>
                    </InputGroup>
                    {current.additionalData?.season?.code && <SeasonAlert code={current.additionalData?.season?.code}/>}
                </FormColumn>

                <FormColumn label="" width={colWidth}>
                    <SpinnerButton type="submit" className="btn btn-sm btn-primary me-1" spinning={saving}
                                   disabled={!productId}>
                        Save
                    </SpinnerButton>
                    <button type="button" className="btn btn-sm btn-outline-secondary me-1"
                            disabled={!productId} onClick={newItemHandler}>
                        New Product
                    </button>
                    <button type="button" className="btn btn-sm btn-outline-danger me-1"
                            onClick={deleteItemHandler} disabled={current.id === 0}>
                        Delete
                    </button>
                </FormColumn>
                <FormColumn label="" width={colWidth}>
                    {current.changed && <Alert color="warning">Don't forget to save your changes.</Alert> }
                </FormColumn>
            </form>
        </>
    )
}

export default ProductColorEditor;
