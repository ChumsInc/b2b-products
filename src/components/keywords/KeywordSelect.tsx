import {type ChangeEvent, useEffect} from "react";
import type {Keyword} from "b2b-types";
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {selectKeywordsList, selectKeywordsLoaded} from "@/ducks/keywords/selectors";
import {loadKeywords} from "@/ducks/keywords/actions";
import {FormSelect, type FormSelectProps} from "react-bootstrap";

export interface KeywordSelectProps extends FormSelectProps {
    pageType: 'product' | 'category' | 'page',
    onSelectKeyword: (kw: Keyword | null) => void,
}

const KeywordSelect = ({pageType, value, onSelectKeyword, ...rest}: KeywordSelectProps) => {
    const dispatch = useAppDispatch();
    const keywords = useAppSelector(selectKeywordsList);
    const loaded = useAppSelector(selectKeywordsLoaded);


    useEffect(() => {
        if (!loaded) {
            dispatch(loadKeywords());
        }
    }, [])

    const changeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        const [kw] = keywords.filter(kw => kw.pagetype === pageType && String(kw.id) === ev.target.value);
        onSelectKeyword(kw || null);
    }

    return (
        <FormSelect size="sm" {...rest} value={value} onChange={changeHandler}>
            <option value="">All</option>
            <option disabled>---</option>
            {keywords
                .filter(kw => kw.pagetype === pageType)
                .filter(kw => !!kw.status || kw.id === value)
                .map(kw => (
                    <option key={kw.keyword} value={kw.id} disabled={!kw.status}>
                        {kw.keyword} - {kw.title}
                    </option>
                ))}
        </FormSelect>
    )
}

export default KeywordSelect;
