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
        <Badge pill
               style={{
                   backgroundColor: season.properties?.color ? `${season.properties.color} !important` : undefined,
                   color: ['SS22', 'SS23', 'SS24'].includes(season.code) ? 'black' : undefined,
               }}>
            <span>
                {code}
                {!(seasonAvailable || season.product_available) && (
                    <span className="bi-exclamation-triangle-fill ms-1"/>
                )}
            </span>
        </Badge>
    )
}

export default SeasonIcon;
