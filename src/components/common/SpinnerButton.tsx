import React from 'react';
import {Button, ButtonProps, SpinnerProps} from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import classNames from "classnames";

export interface SpinnerButtonProps extends ButtonProps {
    spinning?: boolean;
    spinnerProps?: SpinnerProps;
}
export default function SpinnerButton({type, disabled, spinning, children, spinnerProps, ...buttonProps}: SpinnerButtonProps) {
    return (
        <Button type={type} disabled={spinning || disabled} {...buttonProps}>
            {spinning && (
                <Spinner as="span" role="status" aria-hidden="true" size={buttonProps.size === 'sm' ? 'sm' : undefined}
                                  {...spinnerProps} className={classNames('me-1', spinnerProps?.className)} />
            )}
            {children}
        </Button>
    )
}
