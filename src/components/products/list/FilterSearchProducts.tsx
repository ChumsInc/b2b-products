import React, {useId} from 'react';
import {useSelector} from "react-redux";
import {useAppDispatch} from "../../app/hooks";
import {selectProductsSearch, setProductsSearch} from "@/ducks/productList/productListSlice";
import {useDebounceCallback} from "usehooks-ts";
import {FormControl, InputGroup} from "react-bootstrap";

export default function FilterSearchProducts() {
    const dispatch = useAppDispatch();
    const search = useSelector(selectProductsSearch);
    const id = useId();
    const debounced = useDebounceCallback((value: string) => {
        dispatch(setProductsSearch(value));
    }, 350)

    return (
        <InputGroup size="sm">
            <InputGroup.Text as="label" htmlFor={id} aria-label="Search Products">
                <span className="bi-search" aria-hidden="true"/>
            </InputGroup.Text>
            <FormControl size="sm" type="search" id={id}
                         defaultValue={search} onChange={(ev) => debounced(ev.target.value)}/>
        </InputGroup>
    )
}
