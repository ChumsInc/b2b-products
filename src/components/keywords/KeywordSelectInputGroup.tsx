import React, {ReactNode, useId} from 'react';
import KeywordSelect, {KeywordSelectProps} from "./KeywordSelect";
import {InputGroup} from "react-bootstrap";
import {ErrorBoundary} from "react-error-boundary";
import ErrorFallbackComponent from "@/components/app/ErrorFallbackComponent";


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
        <ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
            <InputGroup className="input-group input-group-sm">
                <InputGroup.Text as="label" htmlFor={id} aria-label="Current ID">{value}</InputGroup.Text>
                <KeywordSelect pageType={pageType} id={id}
                               value={value} onSelectKeyword={onSelectKeyword}
                               {...rest}/>
                {children}
            </InputGroup>
        </ErrorBoundary>
    )
}
