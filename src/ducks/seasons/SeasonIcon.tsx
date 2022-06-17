import  React from 'react';
import {useSelector} from "react-redux";
import {selectSeasons} from "./index";
import {Badge} from "chums-ducks";

export interface SeasonIcon {
    code: string,
}

const SeasonIcon:React.FC<SeasonIcon> = ({code}) => {
    const seasons = useSelector(selectSeasons);
    const colorCode = seasons[code]?.properties?.color || undefined;
    return <Badge color="custom" colorCode={colorCode} text={code}/>
}

export default SeasonIcon;
