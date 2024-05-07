import React from 'react';
import {useSelector} from "react-redux";
import {selectSeasons} from "./index";
import MiniChip from "../../components/MiniChip";


export interface SeasonIcon {
    code?: string | null;
    seasonAvailable?: boolean;
}

const SeasonIcon: React.FC<SeasonIcon> = ({code, seasonAvailable}) => {
    const seasons = useSelector(selectSeasons);
    if (!code) {
        return null;
    }
    const colorCode = seasons[code]?.properties?.color || undefined;
    const badgeText = seasonAvailable === false ? (<span>{code} <span className="bi-exclamation-triangle-fill" /></span>) : code;

    return (
        <MiniChip variant="filled" bgColor={colorCode ?? '#FFF'} label={badgeText}/>
    )
}

export default SeasonIcon;
