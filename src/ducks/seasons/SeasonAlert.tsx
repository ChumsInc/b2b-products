import React from 'react';
import {useSelector} from "react-redux";
import {selectSeasons} from "./index";

export interface SeasonAlertProps {
    code: string,
}

const SeasonAlert = ({code}:SeasonAlertProps) => {
    const seasons = useSelector(selectSeasons);
    const message = seasons[code]?.product_teaser || null;
    if (!message) {
        return null;
    }
    return (
        <small className="mb-1 text-muted">{message}</small>
    )
}

export default SeasonAlert;
