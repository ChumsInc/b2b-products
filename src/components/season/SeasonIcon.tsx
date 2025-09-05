import React from 'react';
import {useAppSelector} from "@/components/app/hooks";
import {selectSeasonByCode} from "@/ducks/seasons";
import {Badge} from "react-bootstrap";
import styled from "@emotion/styled";

const BadgeIcon = styled.span`
    --bs-badge-padding-x: 0.65em;
    --bs-badge-padding-y: 0.35em;
    --bs-badge-font-size: 0.75em;
    --bs-badge-font-weight: 700;
    --bs-badge-color: #fff;
    --bs-badge-border-radius: var(--bs-border-radius);
    display: inline-block;
    padding: var(--bs-badge-padding-y) var(--bs-badge-padding-x);
    font-size: var(--bs-badge-font-size);
    font-weight: var(--bs-badge-font-weight);
    line-height: 1;
    color: var(--bs-badge-color);
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: var(--bs-border-radius-pill);
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
        <BadgeIcon
               style={{
                   backgroundColor: season.properties?.color ? `${season.properties.color}` : undefined,
                   color: ['SS22', 'SS23', 'SS24'].includes(season.code) ? 'black' : undefined,
               }}>
            <span>
                {code}
                {!(seasonAvailable || season.product_available) && (
                    <span className="bi-exclamation-triangle-fill ms-1"/>
                )}
            </span>
        </BadgeIcon>
    )
}

export default SeasonIcon;
