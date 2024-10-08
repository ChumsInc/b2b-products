import React, {ChangeEvent} from "react";
import {useSelector} from "react-redux";
import {selectSeasons} from "../../ducks/seasons/selectors";
import {ProductSeason} from "b2b-types";

interface SeasonSelectProps {
    value: string;
    onlyActive?: boolean;
    showTeaser?: boolean;
    onChange: (season:ProductSeason|null) => void;
}
const SeasonSelect:React.FC<SeasonSelectProps> = ({value, onlyActive, showTeaser, onChange}) => {
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
                .map(season => (
                    <option key={season.product_season_id} value={season.code}>
                        {showTeaser ? season.product_teaser : season.code}
                    </option>
                ))}
        </select>
    )
}

export default SeasonSelect;
