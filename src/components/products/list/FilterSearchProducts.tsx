import {useId} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {selectProductsSearch, setProductsSearch} from "@/ducks/productList/productListSlice.ts";
import {FormControl, InputGroup} from "react-bootstrap";
import {useDebouncedCallback} from "@mantine/hooks";

export default function FilterSearchProducts() {
    const dispatch = useAppDispatch();
    const search = useAppSelector(selectProductsSearch);
    const id = useId();
    const debounced = useDebouncedCallback((value: string) => {
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
