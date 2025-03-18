import React from 'react';
import {useAppSelector} from "@/components/app/hooks";
import {selectSeasonByCode} from "@/ducks/seasons";
import {Badge} from "react-bootstrap";


export interface SeasonIconProps {
    code?: string | null;
    seasonAvailable?: boolean;
}

const SeasonIcon = ({code, seasonAvailable}: SeasonIconProps) => {
    const season = useAppSelector((state) => selectSeasonByCode(state, code ?? ''));
    if (!season) {
        return null;
    }

    return (
        <Badge pill style={{backgroundColor: season?.properties?.color ?? '#FFF'}}>
            {
                seasonAvailable ?? season.product_available
                    ? (<span>{code}</span>)
                    : (<span>{code} <span className="bi-exclamation-triangle-fill"/></span>)
            }
        </Badge>
    )
}

export default SeasonIcon;
