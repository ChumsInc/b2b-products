import React, {ChangeEvent, useId} from 'react';
import {useAppDispatch} from "../../app/hooks";
import {useSelector} from "react-redux";
import {selectProductsFilterAvailable, toggleFilterAvailable} from "@/ducks/productList/productListSlice";
import {FormCheck} from "react-bootstrap";

export default function FilterAvailableProducts() {
    const dispatch = useAppDispatch();
    const checked = useSelector(selectProductsFilterAvailable);
    const id = useId();

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(toggleFilterAvailable(ev.target.checked));
    }

    return (
        <FormCheck label="Available" id={id} type="checkbox" checked={checked} onChange={changeHandler}/>
    )
}
