import React, {ChangeEvent, useState} from 'react'
import ItemDataList from "../../item-search/ItemDataList";
import {useDispatch, useSelector} from "react-redux";
import {selectCurrentProduct} from "../selectors";
import {updateProductAction} from "../actions";
import {selectItemSearchList, selectItemSearchLoading} from "../../item-search";


export const ProductItemCodeInput: React.FC = () => {
    const dispatch = useDispatch();
    const {itemCode} = useSelector(selectCurrentProduct);
    const loading = useSelector(selectItemSearchLoading);
    const items = useSelector(selectItemSearchList);

    const [search, setSearch] = useState('');

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        setSearch(ev.target.value);
        return dispatch(updateProductAction({itemCode: ev.target.value}));
    }

    const onCopyToName = () => {
        if (items[itemCode]) {
            dispatch(updateProductAction({name: items[itemCode].ItemCodeDesc}));
        }
    }
    return (
        <>
            <div className="input-group input-group-sm">
                <input type="text" id="product-main--item-code" className="form-control form-control-sm"
                       value={itemCode} onChange={changeHandler}
                       list="product-main--item-code-list"/>
                <button type="button" className="btn btn-secondary" onClick={onCopyToName}>
                    <span className="bi-card-text" title={items[itemCode]?.ItemCodeDesc || ''}/>
                </button>
            </div>
            <ItemDataList id="product-main--item-code-list" search={search}/>
        </>
    )
}

export default ProductItemCodeInput;
