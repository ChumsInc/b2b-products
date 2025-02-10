import React, {ChangeEvent, useEffect, useId, useState} from 'react'
import ItemDataList from "../../item-search/ItemDataList";
import {useSelector} from "react-redux";
import {selectCurrentProduct} from "../../../ducks/products/product/selectors";
import {selectItemSearchList} from "../../../ducks/item-search/selectors";
import {updateProduct} from "../../../ducks/products/product/actions";
import {useAppDispatch} from "../../app/hooks";
import {FormControl, FormControlProps, InputGroup} from "react-bootstrap";
import list from "../../../ducks/products/list";

export interface ProductItemCodeInputProps {
    id?: string;
    inputProps?:FormControlProps;
}

export const ProductItemCodeInput = ({id, inputProps}:ProductItemCodeInputProps) => {
    const dispatch = useAppDispatch();
    const product = useSelector(selectCurrentProduct);
    const items = useSelector(selectItemSearchList);
    const [itemCode, setItemCode] = useState(product?.itemCode ?? '');
    const [search, setSearch] = useState('');
    const inputId = id ?? inputProps?.id ?? useId();
    const listId = useId();

    useEffect(() => {
        setItemCode(product?.itemCode ?? '');
        setSearch(product?.itemCode ?? '');
    }, [product?.itemCode])

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        setSearch(ev.target.value);
        return dispatch(updateProduct({itemCode: ev.target.value}));
    }

    const onCopyToName = () => {
        if (items[itemCode]) {
            dispatch(updateProduct({name: items[itemCode].ItemCodeDesc}));
        }
    }

    return (
        <>
            <InputGroup size="sm" className="input-group input-group-sm">
                <FormControl size="sm" type="text" {...inputProps} id={inputId}
                       value={itemCode} onChange={changeHandler}
                       list={listId}/>
                <button type="button" className="btn btn-secondary" onClick={onCopyToName} disabled={!items[itemCode]}>
                    <span className="bi-card-text" title={items[itemCode]?.ItemCodeDesc || ''}/>
                </button>
            </InputGroup>
            <ItemDataList id={listId} search={search}/>
        </>
    )
}

export default ProductItemCodeInput;
