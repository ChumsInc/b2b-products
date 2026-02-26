import {type ReactNode, useId} from 'react';
import KeywordSelect, {type KeywordSelectProps} from "./KeywordSelect";
import {InputGroup} from "react-bootstrap";
import {ErrorBoundary} from "react-error-boundary";
import ErrorFallbackComponent from "@/components/app/ErrorFallbackComponent";


export interface KeywordSelectInputGroupProps extends KeywordSelectProps {
    disabledKeywords?: string[],
    children?: ReactNode
}

export default function KeywordSelectInputGroup({
                                                    disabledKeywords,
                                                    pageType,
                                                    value,
                                                    onSelectKeyword,
                                                    children,
                                                    id,
                                                    ...rest
                                                }: KeywordSelectInputGroupProps) {
    const _id = useId();
    return (
        <ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
            <InputGroup className="input-group input-group-sm">
                <InputGroup.Text as="label" htmlFor={id ?? _id} aria-label="Current ID">{value}</InputGroup.Text>
                <KeywordSelect pageType={pageType} id={id ?? _id} disabledKeywords={disabledKeywords}
                               value={value} onSelectKeyword={onSelectKeyword}
                               {...rest}/>
                {children}
            </InputGroup>
        </ErrorBoundary>
    )
}
