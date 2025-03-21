import React from 'react';
import {useAppSelector} from "@/components/app/hooks";
import {selectSeasonByCode} from "@/ducks/seasons";

export interface SeasonAlertProps {
    code: string,
}

const SeasonAlert: React.FC<SeasonAlertProps> = ({code}) => {
    const season = useAppSelector((state) => selectSeasonByCode(state, code));
    if (!season.active || !season.preSeasonMessage || !season.product_teaser) {
        return null;
    }
    return (
        <div className="text-secondary text-center">{season.preSeasonMessage ?? season.product_teaser}</div>
    )
}

export default SeasonAlert;
