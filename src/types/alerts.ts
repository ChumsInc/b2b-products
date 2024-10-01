import {BasicAlert} from "chums-components";
import {SerializedError} from "@reduxjs/toolkit";

export interface ExtendedAlert extends BasicAlert {
    count: number;
    error?: SerializedError | null;
}

export interface AlertList {
    [key: string | number]: ExtendedAlert,
}
