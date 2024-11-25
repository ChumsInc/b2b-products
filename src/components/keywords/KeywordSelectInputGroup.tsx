import React, {ReactNode, useId} from 'react';
import KeywordSelect, {KeywordSelectProps} from "./KeywordSelect";
import {InputGroup} from "react-bootstrap";


export interface KeywordSelectInputGroupProps extends KeywordSelectProps {
    children?: ReactNode
}

export default function KeywordSelectInputGroup({
                                                    pageType,
                                                    value,
                                                    onSelectKeyword,
                                                    children,
                                                    ...rest
                                                }: KeywordSelectInputGroupProps) {
    const id = rest.id ?? useId();
    return (
        <InputGroup className="input-group input-group-sm">
            <InputGroup.Text as="label" htmlFor={id} aria-label="Current ID">{value}</InputGroup.Text>
            <KeywordSelect pageType={pageType} id={id}
                           value={value} onSelectKeyword={onSelectKeyword}
                           {...rest}/>
            {children}
        </InputGroup>
    )
}
