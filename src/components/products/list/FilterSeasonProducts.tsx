import {useId} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {selectProductSeasonFilter, setSeasonFilter} from "@/ducks/productList/productListSlice.ts";
import type {ProductSeason} from "b2b-types";
import {InputGroup} from "react-bootstrap";
import SeasonSelect from "../../season/SeasonSelect";

export default function FilterSeasonProducts() {
    const dispatch = useAppDispatch();
    const season = useAppSelector(selectProductSeasonFilter);
    const id = useId();

    const changeHandler = (season: ProductSeason | null) => {
        dispatch(setSeasonFilter(season?.code ?? ''))
    }

    return (
        <InputGroup size="sm">
            <InputGroup.Text as="label" htmlFor={id}>
                Season
            </InputGroup.Text>
            <SeasonSelect value={season} onChange={changeHandler} id={id}/>
        </InputGroup>
    )
}
