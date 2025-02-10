import {SerializedError} from "@reduxjs/toolkit";
import {BasicAlert} from "chums-ui-utils";

export interface ExtendedAlert extends BasicAlert {
    count: number;
    error?: SerializedError | null;
}

export interface AlertList {
    [key: string | number]: ExtendedAlert,
}
