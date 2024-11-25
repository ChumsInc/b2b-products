import React from 'react';
import {useSelector} from "react-redux";
import {selectSeasons} from "../../ducks/seasons/selectors";
import {Alert} from "react-bootstrap";

export interface SeasonAlertProps {
    code: string,
}

const SeasonAlert: React.FC<SeasonAlertProps> = ({code}) => {
    const seasons = useSelector(selectSeasons);
    const message = seasons[code]?.product_teaser || null;
    if (!message) {
        return null;
    }
    return (
        <div className="text-secondary text-center">{message}</div>
    )
}

export default SeasonAlert;
