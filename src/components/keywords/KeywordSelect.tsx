import {type ChangeEvent, useEffect} from "react";
import type {Keyword} from "b2b-types";
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {selectKeywordsList, selectKeywordsLoaded} from "@/ducks/keywords/selectors";
import {loadKeywords} from "@/ducks/keywords/actions";
import {FormSelect, type FormSelectProps} from "react-bootstrap";
import classNames from "classnames";

export interface KeywordSelectProps extends FormSelectProps {
    disabledKeywords?: string[],
    pageType: 'product' | 'category' | 'page',
    onSelectKeyword: (kw: Keyword | null) => void,
}

const KeywordSelect = ({disabledKeywords, pageType, value, onSelectKeyword, ...rest}: KeywordSelectProps) => {
    const dispatch = useAppDispatch();
    const keywords = useAppSelector(selectKeywordsList);
    const loaded = useAppSelector(selectKeywordsLoaded);


    useEffect(() => {
        if (!loaded) {
            dispatch(loadKeywords());
        }
    }, [dispatch, loaded])

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
                    <option key={kw.keyword} value={kw.id} className={classNames({'text-danger': !kw.status})} disabled={disabledKeywords?.includes(kw.keyword)}>
                        {kw.keyword} - {kw.title}
                    </option>
                ))}
        </FormSelect>
    )
}

export default KeywordSelect;
