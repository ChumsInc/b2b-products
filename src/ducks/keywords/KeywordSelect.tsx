import React, {ChangeEvent, ReactNode, SelectHTMLAttributes, useEffect} from 'react';
import {Keyword} from "b2b-types";
import {useSelector} from "react-redux";
import {loadKeywordsAction, selectKeywordsList, selectKeywordsLoaded} from "./index";
import {useAppDispatch} from "../../app/hooks";

export interface KeywordSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    pageType: 'product' | 'category' | 'page',
    onSelectKeyword: (kw: Keyword | null) => void,
    children?: ReactNode
}

const KeywordSelect: React.FC<KeywordSelectProps> = ({pageType, value, onSelectKeyword, children, ...rest}) => {
    const dispatch = useAppDispatch();
    const keywords = useSelector(selectKeywordsList);
    const loaded = useSelector(selectKeywordsLoaded);


    useEffect(() => {
        if (!loaded) {
            dispatch(loadKeywordsAction());
        }
    }, [])


    const changeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        const [kw] = keywords.filter(kw => kw.pagetype === pageType && String(kw.id) === ev.target.value);
        onSelectKeyword(kw || null);
    }

    return (
        <div className="input-group input-group-sm">
            <div className="input-group-text">{value}</div>
            <select className="form-select form-select-sm" value={value} onChange={changeHandler} {...rest}>
                <option value="">-</option>
                {keywords.filter(kw => kw.pagetype === pageType)
                    .filter(kw => !!kw.status)
                    .map(kw => (<option key={kw.keyword} value={kw.id}
                                        disabled={!kw.status}>{kw.keyword} - {kw.title}</option>))}
            </select>
            {children}
        </div>
    )
}

export default KeywordSelect;
