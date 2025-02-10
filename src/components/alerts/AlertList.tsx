import React from 'react';
import {useAppDispatch} from "../app/hooks";
import {useSelector} from "react-redux";
import {dismissAlert, selectAlerts} from "@/ducks/alerts";
import Alert from "react-bootstrap/Alert";
import {Badge} from "react-bootstrap";

const AlertList = () => {
    const dispatch = useAppDispatch();
    const alerts = useSelector(selectAlerts);

    const dismissHandler = (key: number) => dispatch(dismissAlert(key));

    return (
        <div>
            {alerts.map(alert => (
                <Alert key={alert.id} variant={alert.variant ?? 'info'} onClose={() => dismissHandler(alert.id)}>
                    <Alert.Heading>
                        {alert.context && <strong>{alert.context}</strong>}
                        {alert.title}
                        {alert.count > 1 && (
                            <Badge bg={alert.variant}>{alert.count}</Badge>
                        )}
                    </Alert.Heading>
                    {!!alert.error && (
                        <div style={{whiteSpace: 'pre-wrap'}}>{alert.error?.stack}</div>
                    )}
                </Alert>
            ))}
        </div>
    )
}

export default AlertList;
