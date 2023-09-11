import React, {ChangeEvent, useEffect, useState} from 'react'
import ItemDataList from "../../item-search/ItemDataList";
import {useSelector} from "react-redux";
import {selectCurrentProduct} from "./selectors";
import {selectItemSearchList} from "../../item-search";
import {updateProduct} from "./actions";
import {useAppDispatch} from "../../../app/hooks";


export const ProductItemCodeInput = () => {
    const dispatch = useAppDispatch();
    const product = useSelector(selectCurrentProduct);

    const items = useSelector(selectItemSearchList);
    const [itemCode, setItemCode] = useState(product?.itemCode ?? '');
    const [search, setSearch] = useState('');

    useEffect(() => {
        setItemCode(product?.itemCode ?? '');
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
            <div className="input-group input-group-sm">
                <input type="text" id="product-main--item-code" className="form-control form-control-sm"
                       value={itemCode} onChange={changeHandler}
                       list="product-main--item-code-colors"/>
                <button type="button" className="btn btn-secondary" onClick={onCopyToName}>
                    <span className="bi-card-text" title={items[itemCode]?.ItemCodeDesc || ''}/>
                </button>
            </div>
            <ItemDataList id="product-main--item-code-list" search={search}/>
        </>
    )
}

export default ProductItemCodeInput;
