import React, {ChangeEvent, FormEvent, useEffect, useId, useRef, useState} from 'react';
import {useSelector} from "react-redux";
import {Alert, Badge, FormCheck, FormColumn, InputGroup, SpinnerButton} from "chums-components";
import {selectCurrentColorItem, selectCurrentColorStatus} from "../../../ducks/products/color/selectors";
import {selectCurrentProduct, selectCurrentProductId} from "../../../ducks/products/product/selectors";
import {ProductColorItem, ProductColorItemAdditionalData} from "b2b-types/src/products";
import SeasonSelect from "../../season/SeasonSelect";
import {Editable, ProductColor, ProductSeason} from "b2b-types";
import SeasonAlert from "../../season/SeasonAlert";
import {defaultColorItem} from "../../../defaults";
import {removeColorItem, saveCurrentColorItem, setCurrentColorItem} from "../../../ducks/products/color/actions";
import {useAppDispatch} from "../../app/hooks";
import ColorAutoComplete from "../../colors/ColorAutoComplete";
import classNames from "classnames";
import TextareaAutosize from "react-textarea-autosize";
import color from "../../../ducks/products/color";

interface EditableProductColorItem extends ProductColorItem, Editable {
}


const colWidth = 8;
const ProductColorEditor: React.FC = () => {
    const dispatch = useAppDispatch();
    const itemCodeRef = useRef<HTMLInputElement>(null)
    const imageRef = useRef<HTMLInputElement>(null)
    const productId = useSelector(selectCurrentProductId);
    const currentProduct = useSelector(selectCurrentProduct);
    const current = useSelector(selectCurrentColorItem);
    const status = useSelector(selectCurrentColorStatus);
    const seasonAvailableId = useId();

    const [colorItem, setColorItem] = useState<EditableProductColorItem>(current ?? {...defaultColorItem});

    useEffect(() => {
        setColorItem({...defaultColorItem, productId});
        dispatch(setCurrentColorItem(null));
    }, [productId]);

    useEffect(() => {
        setColorItem({...(current ?? defaultColorItem), productId});
    }, [current])

    const submitHandler = async (ev: FormEvent) => {
        ev.preventDefault();
        await dispatch(saveCurrentColorItem({...colorItem, productId}));
        // setColorItem({...defaultColorItem, productId});
    }

    const textChangeHandler = (field: keyof ProductColorItem) => (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        switch (field) {
            case 'itemCode':
            case 'colorCode':
                return setColorItem({...colorItem, [field]: ev.target.value, changed: true});
        }
    }

    const onChangeColorCode = (value: string) => setColorItem({...colorItem, colorCode: value, changed: true});

    const onChangeColor = (color: ProductColor | null) => {
        if (color) {
            return setColorItem({...colorItem, color, colorCode: color.code, changed: true})
        }
    }

    const additionalDataChangeHandler = (field: keyof ProductColorItemAdditionalData) => (ev: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
        const additionalData: ProductColorItemAdditionalData = {...(colorItem?.additionalData ?? {})};
        switch (field) {
            case 'seasonAvailable':
                additionalData[field] = (ev as ChangeEvent<HTMLInputElement>).target.checked;
                return setColorItem({...colorItem, additionalData, changed: true});
            case 'swatch_code':
            case 'image_filename':
            case 'message':
                additionalData[field] = ev.target.value;
                return setColorItem({...colorItem, additionalData, changed: true});
        }
    }

    const additionalDataSelectChangeHandler = (field: keyof ProductColorItemAdditionalData) => (ev: ChangeEvent<HTMLSelectElement>) => {
        const additionalData: ProductColorItemAdditionalData = {...(colorItem?.additionalData ?? {})};
        switch (field) {
            case 'swatch_code':
            case 'image_filename':
                additionalData[field] = ev.target.value;
                return setColorItem({...colorItem, additionalData, changed: true});
        }
    }

    const toggleChangeHandler = (field: keyof ProductColorItem) => () => {
        switch (field) {
            case 'status':
                return setColorItem({...colorItem, [field]: !colorItem[field], changed: true});
        }
    }

    const seasonChangeHandler = (season: ProductSeason | null) => {
        const additionalData: ProductColorItemAdditionalData = {...(colorItem.additionalData || {})};
        additionalData.season_id = season?.product_season_id || 0;
        additionalData.season = season || undefined;
        return setColorItem({...colorItem, additionalData, changed: true});
    }

    const newItemHandler = () => {
        if (!colorItem.changed || window.confirm('Are you sure you want to discard your changes?')) {
            dispatch(setCurrentColorItem({...defaultColorItem, productId}));
        }
    }

    const deleteItemHandler = () => {
        if (!current || !productId || status !== 'idle') {
            return;
        }
        if (window.confirm(`Are you sure you want to delete item ${current.itemCode}?`)) {
            dispatch(removeColorItem(current));
        }
    }

    return (
        <>
            <form onSubmit={submitHandler}>
                <FormColumn label="ID" width={colWidth}>
                    <InputGroup bsSize="sm">
                        <span className="input-group-text">ID</span>
                        <input type="number" readOnly value={colorItem.id} className="form-control form-control-sm"/>
                    </InputGroup>
                </FormColumn>
                <FormColumn label="Color Code" width={colWidth}>
                    <ColorAutoComplete value={colorItem.colorCode} onChange={onChangeColorCode}
                                       swatchFormat={colorItem.additionalData?.swatch_code ?? currentProduct?.additionalData?.swatch_format}
                                       onChangeColor={onChangeColor}/>
                </FormColumn>
                <FormColumn label="Item Code" width={colWidth}>
                    <input type="text" className="form-control form-control-sm" ref={itemCodeRef}
                           value={colorItem.itemCode} onChange={textChangeHandler('itemCode')} required/>

                </FormColumn>
                <FormColumn label="Image" width={colWidth}>
                    <input type="text" className="form-control form-control-sm" ref={imageRef}
                           placeholder={currentProduct?.image}
                           value={colorItem.additionalData?.image_filename || ''}
                           onChange={additionalDataChangeHandler('image_filename')}/>
                </FormColumn>
                <FormColumn label="Swatch Override" width={colWidth}>
                    <input type="text" className="form-control form-control-sm" ref={imageRef}
                           placeholder={currentProduct?.additionalData?.swatch_code ?? ''}
                           value={colorItem.additionalData?.swatch_code || ''}
                           onChange={additionalDataChangeHandler('swatch_code')}/>
                </FormColumn>
                <FormColumn label="Status" width={colWidth} align="baseline">
                    <FormCheck label='Enabled' checked={colorItem.status} onChange={toggleChangeHandler('status')}
                               type="checkbox" inline/>
                    {(colorItem.inactiveItem || colorItem.productType === 'D') &&
                        <Badge color="danger">Inactive</Badge>}
                    {!!colorItem.productStatus && <Badge color="warning">{colorItem.productStatus}</Badge>}
                    {!!colorItem.id && colorItem.productType === null &&
                        <Alert color="danger">Item <strong>{colorItem.itemCode}</strong> does not exist.</Alert>}
                </FormColumn>
                <FormColumn label="Message" width={8}>
                    <TextareaAutosize value={colorItem.additionalData?.message ?? ''} onChange={additionalDataChangeHandler('message')}
                                      className="form-control form-control-sm">

                    </TextareaAutosize>
                </FormColumn>
                <FormColumn label="" width={12} className="mb-1">
                    <InputGroup bsSize="sm">
                        <span className="input-group-text">Season</span>
                        <SeasonSelect value={colorItem.additionalData?.season?.code || ''}
                                      onChange={seasonChangeHandler}/>
                        <div className="input-group-text">
                            <label className="form-check-label me-3"
                                   htmlFor={seasonAvailableId}>Available</label>
                            <input type="checkbox" id={seasonAvailableId} className="form-check-input"
                                   checked={colorItem.additionalData?.seasonAvailable ?? false}
                                   disabled={!colorItem.additionalData?.season_id}
                                   onChange={additionalDataChangeHandler('seasonAvailable')}/>
                        </div>

                    </InputGroup>
                    {colorItem.additionalData?.season?.code &&
                        <SeasonAlert code={colorItem.additionalData?.season?.code}/>}
                </FormColumn>

                <FormColumn label="" width={12}>
                    <div className="d-flex justify-content-end">
                        <SpinnerButton type="submit" className={classNames("btn btn-sm me-1", {'btn-primary': !colorItem.changed, 'btn-warning': colorItem.changed})}
                                       spinning={status === 'saving'}
                                       disabled={!productId || status !== 'idle'}>
                            {colorItem.changed && <span className="bi-exclamation-triangle-fill me-1" />}
                            Save
                        </SpinnerButton>
                        <button type="button" className="btn btn-sm btn-outline-secondary me-1"
                                disabled={!productId} onClick={newItemHandler}>
                            New Product
                        </button>
                        <SpinnerButton type="button" color="danger" size="sm" spinning={status === 'deleting'}
                                       onClick={deleteItemHandler}
                                       disabled={!current?.id || !productId || status !== 'idle'}>
                            Delete
                        </SpinnerButton>
                    </div>
                </FormColumn>
            </form>
        </>
    )
}

export default ProductColorEditor;
