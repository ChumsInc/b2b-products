import {type ChangeEvent, useId} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {selectProductsFilterActive, toggleFilterActive} from "@/ducks/productList/productListSlice.ts";
import {localStorageKeys, setPreference} from "@/src/api/preferences";
import {FormCheck} from "react-bootstrap";

export default function FilterActiveProducts() {
    const dispatch = useAppDispatch();
    const checked = useAppSelector(selectProductsFilterActive);
    const id = useId();

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        setPreference(localStorageKeys.products.filterActive, ev.target.checked);
        dispatch(toggleFilterActive(ev.target.checked));
    }

    return (
        <FormCheck label="Active" id={id} type="checkbox" checked={checked} onChange={changeHandler}/>
    )
}
