import {type ChangeEvent, useId} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {selectProductsFilterOnSale, toggleFilterOnSale} from "@/ducks/productList/productListSlice.ts";
import {FormCheck} from "react-bootstrap";

export default function FilterOnSaleProducts() {
    const dispatch = useAppDispatch();
    const checked = useAppSelector(selectProductsFilterOnSale);
    const id = useId();

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(toggleFilterOnSale(ev.target.checked));
    }

    return (
        <FormCheck label="On Sale" id={id} type="checkbox" checked={checked} onChange={changeHandler}/>
    )
}
