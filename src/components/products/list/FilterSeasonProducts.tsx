import React, {useId} from 'react';
import {useAppDispatch} from "../../app/hooks";
import {useSelector} from "react-redux";
import {selectProductSeasonFilter, setSeasonFilter} from "@/ducks/productList/productListSlice";
import {ProductSeason} from "b2b-types";
import {InputGroup} from "react-bootstrap";
import SeasonSelect from "../../season/SeasonSelect";

export default function FilterSeasonProducts() {
    const dispatch = useAppDispatch();
    const season = useSelector(selectProductSeasonFilter);
    const id = useId();

    const changeHandler = (season: ProductSeason | null) => {
        dispatch(setSeasonFilter(season?.code ?? ''))
    }

    return (
        <InputGroup size="sm">
            <InputGroup.Text as="label" htmlFor={id}>
                Season
            </InputGroup.Text>
            <SeasonSelect value={season} onChange={changeHandler} includeInactive id={id}/>
        </InputGroup>
    )
}
