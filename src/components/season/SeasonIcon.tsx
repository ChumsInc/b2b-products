import React from 'react';
import {useAppSelector} from "@/components/app/hooks";
import {selectSeasonByCode} from "@/ducks/seasons";
import {Badge} from "react-bootstrap";
import styled from "@emotion/styled";


const SeasonBadge = styled(Badge)`
    background-color: ${props => (props.seasonColor ? props.seasonColor : undefined)} !important;
    color: ${props => (['SS22', 'SS23', 'SS24'].includes(props.seasonCode) ? 'black' : undefined)};
    
`

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
        <SeasonBadge pill seasonColor={season?.properties?.color} seasonCode={season.code}>
            {
                seasonAvailable ?? season.product_available
                    ? (<span>{code}</span>)
                    : (<span>{code} <span className="bi-exclamation-triangle-fill"/></span>)
            }
        </SeasonBadge>
    )
}

export default SeasonIcon;
