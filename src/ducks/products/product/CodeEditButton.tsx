import React, {ReactNode} from 'react';

export interface CodeEditButtonProps {
    onClick: () => void,
    children?: ReactNode
}

const CodeEditButton = ({onClick, children}:CodeEditButtonProps) => {
    return (
        <span className="bi-code-slash btn btn-sm btn-outline-secondary" onClick={onClick}>
            <span className="ms-1">{children}</span>
        </span>
    );
}

export default CodeEditButton
