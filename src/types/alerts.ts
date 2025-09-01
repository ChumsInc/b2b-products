import type {SerializedError} from "@reduxjs/toolkit";
import type {BasicAlert} from "chums-ui-utils";

export interface ExtendedAlert extends BasicAlert {
    count: number;
    error?: SerializedError | null;
}

export interface AlertList {
    [key: string | number]: ExtendedAlert,
}
