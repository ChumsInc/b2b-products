import {type ChangeEvent, useId} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {selectProductsShowInactive, toggleShowInactive} from "@/ducks/productList/productListSlice.ts";
import {localStorageKeys, setPreference} from "@/src/api/preferences";
import {FormCheck} from "react-bootstrap";

export default function FilterActiveProducts() {
    const dispatch = useAppDispatch();
    const checked = useAppSelector(selectProductsShowInactive);
    const id = useId();

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        setPreference(localStorageKeys.products.showInactive, ev.target.checked);
        dispatch(toggleShowInactive(ev.target.checked));
    }

    return (
        <FormCheck label="Show Inactive" id={id} type="checkbox" checked={checked} onChange={changeHandler}/>
    )
}
