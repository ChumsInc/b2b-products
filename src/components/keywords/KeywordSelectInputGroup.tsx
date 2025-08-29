import {type ReactNode, useId} from 'react';
import KeywordSelect, {type KeywordSelectProps} from "./KeywordSelect";
import {InputGroup} from "react-bootstrap";


export interface KeywordSelectInputGroupProps extends KeywordSelectProps {
    children?: ReactNode
}

export default function KeywordSelectInputGroup({
                                                    pageType,
                                                    value,
                                                    onSelectKeyword,
                                                    children,
                                                    id,
                                                    ...rest
                                                }: KeywordSelectInputGroupProps) {
    const _id = useId();
    return (
        <InputGroup className="input-group input-group-sm">
            <InputGroup.Text as="label" htmlFor={id ?? _id} aria-label="Current ID">{value}</InputGroup.Text>
            <KeywordSelect pageType={pageType} id={id ?? _id}
                           value={value} onSelectKeyword={onSelectKeyword}
                           {...rest}/>
            {children}
        </InputGroup>
    )
}
