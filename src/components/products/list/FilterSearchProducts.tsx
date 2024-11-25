import react, {ChangeEvent, useId} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useAppDispatch} from "../../app/hooks";
import {selectProductsSearch} from "../../../ducks/products/list/selectors";
import {useDebounceCallback} from "usehooks-ts";
import {setProductsSearch} from "../../../ducks/products/list/actions";
import {FormControl, InputGroup} from "react-bootstrap";
import React from "react";

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
            <FormControl size="sm" type="search"
                         defaultValue={search} onChange={(ev) => debounced(ev.target.value)} />
        </InputGroup>
    )
}
