import React, {ChangeEvent} from "react";
import {useSelector} from "react-redux";
import {ProductSeason} from "b2b-types";
import {FormSelect, FormSelectProps} from "react-bootstrap";
import {selectSeasonsList} from "@/ducks/seasons";

interface SeasonSelectProps extends Omit<FormSelectProps, 'onChange'> {
    value: string;
    includeInactive?: boolean;
    showTeaser?: boolean;
    onChange: (season: ProductSeason | null) => void;
    ref?: React.Ref<HTMLSelectElement>;
}

export default function SeasonSelect({
                                         value,
                                         includeInactive,
                                         showTeaser,
                                         onChange,
                                         ref,
                                         ...rest
                                     }: SeasonSelectProps) {
    const seasons = useSelector(selectSeasonsList);

    const changeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        const [season] = seasons.filter(season => season.code === ev.target.value);
        onChange(season || null);
    }

    return (
        <FormSelect size="sm" value={value} onChange={changeHandler} ref={ref} {...rest}>
            <option value="">All</option>
            {seasons
                .filter(season => includeInactive || season.active)
                .sort((a, b) => a.code.toLowerCase().localeCompare(b.code.toLowerCase()))
                .map(season => (
                    <option key={season.product_season_id} value={season.code}>
                        {showTeaser ? season.product_teaser : season.code}
                    </option>
                ))}
        </FormSelect>
    )
}
