import React, {ReactNode} from 'react';
import {Button, ButtonProps} from "react-bootstrap";
import classNames from "classnames";

export interface CodeEditButtonProps extends ButtonProps {
    icon?: string;
    onClick: () => void,
    children?: ReactNode
}

export default function CodeEditButton({icon, onClick, children, ...rest}:CodeEditButtonProps) {
    return (
        <Button type="button" variant="outline-secondary" size="sm" {...rest} onClick={onClick}>
            {children}
            <span className={classNames(icon ?? "bi-code", 'ms-1')} />
        </Button>
    );
}
