import React, {ChangeEvent} from "react";
import {useSelector} from "react-redux";
import {selectSeasons} from "../../ducks/seasons/selectors";
import {ProductSeason} from "b2b-types";
import {FormSelect, FormSelectProps} from "react-bootstrap";

interface SeasonSelectProps extends Omit<FormSelectProps, 'onChange'> {
    value: string;
    includeInactive?: boolean;
    showTeaser?: boolean;
    onChange: (season: ProductSeason | null) => void;
}

export default React.forwardRef<HTMLSelectElement, SeasonSelectProps>(
    function SeasonSelect({value, includeInactive, showTeaser, onChange}, ref) {
        const seasons = useSelector(selectSeasons);

        const changeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
            const season = seasons[ev.target.value]
            onChange(season || null);
        }
        return (
            <FormSelect size="sm" value={value} onChange={changeHandler} ref={ref}>
                <option value="">All</option>
                {Object.values(seasons)
                    .filter(season => includeInactive || season.active)
                    .sort((a, b) => a.code.toLowerCase() > b.code.toLowerCase() ? 1 : -1)
                    .map(season => (
                        <option key={season.product_season_id} value={season.code}>
                            {showTeaser ? season.product_teaser : season.code}
                        </option>
                    ))}
            </FormSelect>
        )
    })
