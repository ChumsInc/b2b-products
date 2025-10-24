import React, {type ChangeEvent} from "react";
import type {ProductSeason} from "b2b-types";
import {FormSelect, type FormSelectProps} from "react-bootstrap";
import {selectSortedSeasons} from "@/ducks/seasons";
import {useAppSelector} from "@/app/configureStore";
import {ErrorBoundary} from "react-error-boundary";
import ErrorFallbackComponent from "@/components/app/ErrorFallbackComponent";

interface SeasonSelectProps extends Omit<FormSelectProps, 'onChange'> {
    value: string;
    includeInactive?: boolean;
    showTeaser?: boolean;
    onChange: (season: ProductSeason | null) => void;
    ref?: React.Ref<HTMLSelectElement>;
}

export default function SeasonSelect({
                                         value,
                                         showTeaser,
                                         onChange,
                                         ref,
                                         ...rest
                                     }: SeasonSelectProps) {
    const seasons = useAppSelector(selectSortedSeasons);

    const changeHandler = (ev: ChangeEvent<HTMLSelectElement>) => {
        const [season] = seasons.filter(season => season.code === ev.target.value);
        onChange(season || null);
    }

    return (
        <ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
            <FormSelect size="sm" value={value} onChange={changeHandler} ref={ref} {...rest}>
                <option value="">All</option>
                {seasons
                    .map(season => (
                        <option key={season.product_season_id} value={season.code}>
                            {showTeaser ? season.product_teaser : season.code}
                        </option>
                    ))}
            </FormSelect>
        </ErrorBoundary>
    )
}
