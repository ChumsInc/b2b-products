import {createEntityAdapter, createSlice, isRejected, PayloadAction, SerializedError,} from "@reduxjs/toolkit";
import {RootState} from "../../app/configureStore";
import {BasicAlert, ErrorAlert} from "chums-ui-utils";
import {AlertProps} from "react-bootstrap";

export interface UIAlert extends Omit<ErrorAlert, 'context'>,
    Partial<Pick<ErrorAlert, 'context'>>,
    Pick<AlertProps, 'variant'>, Pick<BasicAlert, 'title'> {
    error?: SerializedError;
}

export type BaseUIAlert = BasicAlert & Pick<AlertProps, 'variant'>;

const alertsAdapter = createEntityAdapter<UIAlert, number>({
    selectId: (item) => item.id,
    sortComparer: (a, b) => a.id - b.id,
})

const alertsAdapterSelectors = alertsAdapter.getSelectors();

const alertsSlice = createSlice({
    name: 'alerts',
    initialState: alertsAdapter.getInitialState({nextId: 0}),
    reducers: {
        setAlert(state, action: PayloadAction<BaseUIAlert>) {
            if (action.payload.context) {
                const [alert] = alertsAdapterSelectors.selectAll(state)
                    .filter(alert => alert.context === action.payload.context);
                if (alert) {
                    alertsAdapter.updateOne(state, {id: alert.id, changes: {count: alert.count + 1}});
                } else {
                    state.nextId = state.nextId + 1;
                    const alert: UIAlert = {
                        id: state.nextId,
                        count: 1,
                        context: action.payload.context,
                        title: action.payload.title,
                        variant: action.payload.variant,
                        message: action.payload.message ?? 'An unknown error occurred.',
                    }
                    alertsAdapter.addOne(state, alert);
                }
            } else {
                state.nextId = state.nextId + 1;
                const alert: UIAlert = {
                    ...action.payload,
                    id: state.nextId,
                    count: 1,
                    message: action.payload.message ?? 'An unknown error occurred.',
                }
                alertsAdapter.addOne(state, alert);
            }
        },
        dismissAlert(state, action: PayloadAction<number>) {
            alertsAdapter.removeOne(state, action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(isRejected, (state, action) => {
                const context = action.type.replace('/rejected', '');
                const [alert] = alertsAdapterSelectors.selectAll(state)
                    .filter(alert => alert.context === context);
                if (alert) {
                    alertsAdapter.updateOne(state, {id: alert.id, changes: {count: alert.count + 1}});
                } else {
                    state.nextId = state.nextId + 1;
                    const alert: UIAlert = {
                        id: state.nextId,
                        count: 1,
                        context: context,
                        variant: 'danger',
                        message: action.error?.message ?? 'An unknown error occurred.',
                        error: action.error,
                    }
                    alertsAdapter.addOne(state, alert)
                }
            })
    }
})
export const {setAlert, dismissAlert} = alertsSlice.actions;

export const selectAlerts = (state: RootState) => alertsAdapterSelectors.selectAll(state.alerts)

export default alertsSlice;
