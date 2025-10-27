import {type ChangeEvent, useId} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {selectProductsShowUnavailable, toggleShowUnavailable} from "@/ducks/productList/productListSlice.ts";
import {FormCheck} from "react-bootstrap";

export default function FilterAvailableProducts() {
    const dispatch = useAppDispatch();
    const checked = useAppSelector(selectProductsShowUnavailable);
    const id = useId();

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(toggleShowUnavailable(ev.target.checked));
    }

    return (
        <FormCheck label="Show Unavailable" id={id} type="checkbox" checked={checked} onChange={changeHandler}/>
    )
}
