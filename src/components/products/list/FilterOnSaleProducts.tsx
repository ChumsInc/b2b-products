import React, {ChangeEvent, useId} from 'react';
import {useAppDispatch} from "../../app/hooks";
import {useSelector} from "react-redux";
import {selectProductsFilterOnSale} from "../../../ducks/products/list/selectors";
import {toggleFilterOnSale} from "../../../ducks/products/list/actions";
import {FormCheck} from "react-bootstrap";

export default function FilterOnSaleProducts() {
    const dispatch = useAppDispatch();
    const checked = useSelector(selectProductsFilterOnSale);
    const id = useId();

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(toggleFilterOnSale(ev.target.checked));
    }

    return (
        <FormCheck label="On Sale" id={id} type="checkbox" checked={checked} onChange={changeHandler}/>
    )
}