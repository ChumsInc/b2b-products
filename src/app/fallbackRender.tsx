import React from 'react';
import {FallbackProps} from "react-error-boundary";
import {Alert} from "chums-components";

export default function fallbackRender({error, resetErrorBoundary}:FallbackProps) {
    return (
        <Alert color="danger" canDismiss={true} onDismiss={() => resetErrorBoundary()}>
            <p>Sumthin' went wrong!</p>
            <pre style={{color: 'var(--bs-danger)'}}>
                {error.message}
            </pre>
        </Alert>
    )
}
