import React, {ChangeEvent} from "react";
import {useSelector} from "react-redux";
import {selectSeasons} from "./index";
import {ProductSeason} from "b2b-types";

interface SeasonSelectProps {
    value: string,
    onlyActive: boolean,
    onChange: (season:ProductSeason|null) => void,
}
const SeasonSelect:React.FC<SeasonSelectProps> = ({value, onlyActive, onChange}) => {
    const seasons = useSelector(selectSeasons);
    const changeHandler = (ev:ChangeEvent<HTMLSelectElement>) => {
        const season = seasons[ev.target.value]
        onChange(season || null);
    }
    return (
        <select className="form-select form-select-sm" value={value} onChange={changeHandler}>
            <option value="">-</option>
            {Object.values(seasons)
                .filter(season => !onlyActive || season.active)
                .sort((a,b) => a.code.toLowerCase() > b.code.toLowerCase() ? 1 : -1)
                .map(season => <option key={season.product_season_id} value={season.code}>{season.code}</option>)}
        </select>
    )
}

export default SeasonSelect;
