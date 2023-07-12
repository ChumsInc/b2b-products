import React, {ChangeEvent, SelectHTMLAttributes, useEffect} from "react";
import {Keyword} from "b2b-types";
import {useAppDispatch} from "../../app/hooks";
import {useSelector} from "react-redux";
import {loadKeywords, selectKeywordsList, selectKeywordsLoaded, selectKeywordsLoading} from "./index";

export interface KeywordSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    pageType: 'product' | 'category' | 'page',
    onSelectKeyword: (kw: Keyword | null) => void,
}

const KeywordSelect = ({pageType, value, onSelectKeyword, ...rest}: KeywordSelectProps) => {
    const dispatch = useAppDispatch();
    const keywords = useSelector(selectKeywordsList);
    const loaded = useSelector(selectKeywordsLoaded);
    const loading = useSelector(selectKeywordsLoading);


    useEffect(() => {
        if (!loaded && !loading) {
            dispatch(loadKeywords());
        }
    }, [])


    const changeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        const [kw] = keywords.filter(kw => kw.pagetype === pageType && String(kw.id) === ev.target.value);
        onSelectKeyword(kw || null);
    }

    return (
        <select className="form-select form-select-sm" value={value} onChange={changeHandler} {...rest}>
            <option value="">-</option>
            {keywords
                .filter(kw => kw.pagetype === pageType)
                .filter(kw => !!kw.status || kw.id === value)
                .map(kw => (
                    <option key={kw.keyword} value={kw.id}
                                    disabled={!(kw.status || kw.keyword === value)}>
                        {kw.keyword} - {kw.title}
                    </option>
                ))}
        </select>
    )
}

export default KeywordSelect;
