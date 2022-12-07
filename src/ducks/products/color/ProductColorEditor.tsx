import React, {ChangeEvent, FormEvent, useEffect, useRef, useState} from 'react';
import {useSelector} from "react-redux";
import {Alert, FormCheck, FormColumn, InputGroup, noop, SpinnerButton} from "chums-components";
import {selectCurrentColorItem, selectCurrentColorItemSaving} from "./selectors";
import {selectCurrentProductId} from "../product/selectors";
import {ProductColorItem, ProductColorItemAdditionalData} from "b2b-types/src/products";
import SeasonSelect from "../../seasons/SeasonSelect";
import {Editable, ProductColor, ProductSeason} from "b2b-types";
import SeasonAlert from "../../seasons/SeasonAlert";
import {defaultColorItem} from "../../../defaults";
import ColorDataList from "../../colors/ColorDataList";
import {selectColorByCode} from "../../colors/selectors";
import {RootState} from "../../../app/configureStore";
import {removeColorItem, saveCurrentColorItem, setCurrentColorItem} from "./actions";
import {useAppDispatch} from "../../../app/hooks";
import ColorAutoComplete from "../../colors/ColorAutoComplete";

interface EditableProductColorItem extends ProductColorItem, Editable {
}


const colWidth = 8;
const ProductColorEditor: React.FC = () => {
    const dispatch = useAppDispatch();
    const colorCodeRef = useRef<HTMLInputElement>(null)
    const itemCodeRef = useRef<HTMLInputElement>(null)
    const imageRef = useRef<HTMLInputElement>(null)
    const productId = useSelector(selectCurrentProductId);
    const current = useSelector(selectCurrentColorItem);
    const saving = useSelector(selectCurrentColorItemSaving);
    const color = useSelector((state: RootState) => selectColorByCode(state, current?.colorCode ?? ''));

    const [colorItem, setColorItem] = useState<EditableProductColorItem>(current ?? {...defaultColorItem});

    useEffect(() => {
        setColorItem({...defaultColorItem, productId});
        dispatch(setCurrentColorItem(null));
    }, [productId]);

    useEffect(() => {
        setColorItem(current ?? defaultColorItem);
    }, [current])

    // useEffect(() => {
    //     if (!colorItem.colorCode && colorCodeRef.current) {
    //         colorCodeRef.current.focus();
    //     } else if (!colorItem.itemCode && itemCodeRef.current) {
    //         itemCodeRef.current.focus()
    //     } else if (!colorItem.additionalData?.image_filename && imageRef.current) {
    //         imageRef.current.focus();
    //     }
    // }, [current?.id]);

    const submitHandler = (ev: FormEvent) => {
        ev.preventDefault();
        dispatch(saveCurrentColorItem({...colorItem}));
    }

    const textChangeHandler = (field: keyof ProductColorItem) => (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        switch (field) {
        case 'itemCode':
        case 'colorCode':
            return setColorItem({...colorItem, [field]: ev.target.value, changed: true});
        }
    }

    const onChangeColorCode = (value:string) => setColorItem({...colorItem, colorCode: value, changed: true});

    const onChangeColor = (color:ProductColor | null) => {
        if (color) {
            return setColorItem({...colorItem, color, colorCode: color.code, changed: true})
        }
    }

    const additionalDataChangeHandler = (field: keyof ProductColorItemAdditionalData) => (ev: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        switch (field) {
        case 'swatch_code':
        case 'image_filename':
            const additionalData: ProductColorItemAdditionalData = colorItem?.additionalData || {};
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
        if (!current || !productId || saving) {
            return;
        }
        if (window.confirm(`Are you sure you want to delete item ${current.itemCode}?`)) {
            dispatch(removeColorItem(current));
        }
    }

    return (
        <>
            <form onSubmit={submitHandler} className="mt-3">
                <FormColumn label="ID" width={colWidth}>
                    <InputGroup bsSize="sm">
                        <input type="number" readOnly value={colorItem.id} className="form-control form-control-sm"/>
                    </InputGroup>
                </FormColumn>
                <FormColumn label="Color Code" width={colWidth}>
                    <ColorAutoComplete value={colorItem.colorCode} onChange={onChangeColorCode} onChangeColor={onChangeColor} />
                </FormColumn>
                <FormColumn label="Item Code" width={colWidth}>
                    <input type="text" className="form-control form-control-sm" ref={itemCodeRef}
                           value={colorItem.itemCode} onChange={textChangeHandler('itemCode')} required/>

                </FormColumn>
                <FormColumn label="Status" width={colWidth} align="baseline">
                    <FormCheck label='Enabled' checked={colorItem.status} onChange={toggleChangeHandler('status')}
                               type="checkbox" inline/>
                    <FormCheck label='Inactive' checked={!!colorItem.inactiveItem} onChange={noop} disabled
                               type="checkbox" inline/>
                    <FormCheck label='Disco' checked={colorItem.productType === 'D'} onChange={noop} disabled
                               type="checkbox" inline/>
                    {!!colorItem.id && colorItem.productType === null &&
                        <Alert color="danger">Item <strong>{colorItem.itemCode}</strong> does not exist.</Alert>}
                </FormColumn>
                <FormColumn label="Image" width={colWidth}>
                    <input type="text" className="form-control form-control-sm" ref={imageRef}
                           value={colorItem.additionalData?.image_filename || ''}
                           onChange={additionalDataChangeHandler('image_filename')}/>
                </FormColumn>
                <FormColumn label="Order Type" width={colWidth}>
                    <InputGroup bsSize="sm">
                        <span className="input-group-text">Season</span>
                        <SeasonSelect value={colorItem.additionalData?.season?.code || ''} onlyActive={true}
                                      onChange={seasonChangeHandler}/>
                    </InputGroup>
                    {colorItem.additionalData?.season?.code &&
                        <SeasonAlert code={colorItem.additionalData?.season?.code}/>}
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
                            onClick={deleteItemHandler} disabled={!current?.id || !productId || saving}>
                        Delete
                    </button>
                </FormColumn>
                <FormColumn label="" width={colWidth}>
                    {colorItem.changed && <Alert color="warning">Don't forget to save your changes.</Alert>}
                </FormColumn>
            </form>
        </>
    )
}

export default ProductColorEditor;
