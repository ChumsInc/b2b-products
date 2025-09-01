import {useAppDispatch} from "../app/hooks";
import {useSelector} from "react-redux";
import Alert from "react-bootstrap/Alert";
import {Badge} from "react-bootstrap";
import {dismissAlert, selectAllAlerts, type StyledErrorAlert} from "@chumsinc/alert-list";

const AlertList = () => {
    const dispatch = useAppDispatch();
    const alerts = useSelector(selectAllAlerts);

    const dismissHandler = (alert: StyledErrorAlert) => dispatch(dismissAlert(alert));

    return (
        <div>
            {alerts.map(alert => (
                <Alert key={alert.id} variant={alert.variant ?? 'info'} onClose={() => dismissHandler(alert)}>
                    <Alert.Heading>
                        {alert.context && <strong>{alert.context}</strong>}
                        {alert.count > 1 && (
                            <Badge bg={alert.variant}>{alert.count}</Badge>
                        )}
                    </Alert.Heading>
                    {!!alert.message && (
                        <div style={{whiteSpace: 'pre-wrap'}}>{alert.message}</div>
                    )}
                </Alert>
            ))}
        </div>
    )
}

export default AlertList;
