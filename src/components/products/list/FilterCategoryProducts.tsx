import {useId} from 'react';
import {InputGroup} from "react-bootstrap";
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {selectProductsFilterCategoryId, setCategoryFilter} from "@/ducks/productList/productListSlice.ts";
import KeywordSelect from "../../keywords/KeywordSelect";
import type {Keyword} from "b2b-types";

export default function FilterCategoryProducts() {
    const dispatch = useAppDispatch();
    const categoryId = useAppSelector(selectProductsFilterCategoryId);
    const id = useId();

    const changeHandler = (kw: Keyword | null) => {
        dispatch(setCategoryFilter(kw?.id ?? null));
    }

    return (
        <InputGroup size="sm">
            <InputGroup.Text as="label" htmlFor={id}>Category</InputGroup.Text>
            <KeywordSelect pageType="category" id={id} value={categoryId ?? ''} style={{maxWidth: '15rem'}}
                           onSelectKeyword={changeHandler}/>
        </InputGroup>
    )
}
