import {type ChangeEvent, useId} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {selectProductsFilterAvailable, toggleFilterAvailable} from "@/ducks/productList/productListSlice.ts";
import {FormCheck} from "react-bootstrap";

export default function FilterAvailableProducts() {
    const dispatch = useAppDispatch();
    const checked = useAppSelector(selectProductsFilterAvailable);
    const id = useId();

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(toggleFilterAvailable(ev.target.checked));
    }

    return (
        <FormCheck label="Available" id={id} type="checkbox" checked={checked} onChange={changeHandler}/>
    )
}
