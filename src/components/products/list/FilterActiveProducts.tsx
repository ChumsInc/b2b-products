import React, {ChangeEvent, useId} from 'react';
import {useAppDispatch} from "../../app/hooks";
import {useSelector} from "react-redux";
import {selectProductsFilterActive} from "../../../ducks/products/list/selectors";
import {localStorageKeys, setPreference} from "../../../api/preferences";
import {toggleFilterActive} from "../../../ducks/products/list/actions";
import {FormCheck} from "react-bootstrap";

export default function FilterActiveProducts() {
    const dispatch = useAppDispatch();
    const checked = useSelector(selectProductsFilterActive);
    const id = useId();

    const changeHandler = (ev:ChangeEvent<HTMLInputElement>) => {
        setPreference(localStorageKeys.products.filterActive, ev.target.checked);
        dispatch(toggleFilterActive(ev.target.checked));
    }

    return (
        <FormCheck label="Active"  id={id} type="checkbox" checked={checked} onChange={changeHandler} />
    )
}
