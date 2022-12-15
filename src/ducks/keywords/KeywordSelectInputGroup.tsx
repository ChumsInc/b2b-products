import React, {ReactNode, SelectHTMLAttributes} from 'react';
import {Keyword} from "b2b-types";
import KeywordSelect from "./KeywordSelect";


export interface KeywordSelectInputGroupProps extends SelectHTMLAttributes<HTMLSelectElement> {
    pageType: 'product' | 'category' | 'page',
    onSelectKeyword: (kw: Keyword | null) => void,
    children?: ReactNode
}

const KeywordSelectInputGroup = ({
                                     pageType,
                                     value,
                                     onSelectKeyword,
                                     children,
                                     ...rest
                                 }: KeywordSelectInputGroupProps) => {
    return (
        <div className="input-group input-group-sm">
            <div className="input-group-text">{value}</div>
            <KeywordSelect pageType={pageType}
                           value={value} onSelectKeyword={onSelectKeyword}
                           {...rest}/>
            {children}
        </div>
    )
}

export default KeywordSelectInputGroup;
