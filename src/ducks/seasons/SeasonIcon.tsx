import  React from 'react';
import {useSelector} from "react-redux";
import {selectSeasons} from "./index";
import {Badge} from "chums-components";

export interface SeasonIcon {
    code: string|null,
}

const SeasonIcon:React.FC<SeasonIcon> = ({code}) => {
    const seasons = useSelector(selectSeasons);
    if (!code) {
        return null;
    }
    const colorCode = seasons[code]?.properties?.color || undefined;
    return <Badge color="custom" colorCode={colorCode} text={code}/>
}

export default SeasonIcon;
