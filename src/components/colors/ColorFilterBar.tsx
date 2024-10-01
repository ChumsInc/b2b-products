import React, {ChangeEvent} from "react";
import {useSelector} from "react-redux";

import {FormCheck, SpinnerButton} from "chums-components";
import {loadColors, setColorFilter, toggleFilterInactiveColors} from "../../ducks/colors/actions";
import {selectColorFilter, selectColorsFilterInactive, selectColorsLoading, selectColorsStatus} from "../../ducks/colors/selectors";
import {useAppDispatch} from "../app/hooks";


const ColorFilterBar: React.FC = () => {
    const dispatch = useAppDispatch();
    const loading = useSelector(selectColorsLoading);
    const filter = useSelector(selectColorFilter);
    const filterInactive = useSelector(selectColorsFilterInactive);

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(setColorFilter(ev.target.value));
    }
    const toggleHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(toggleFilterInactiveColors(ev.target.checked));
    }

    return (
        <div className="row g-3 align-items-baseline">
            <h2 className="col">Color List</h2>
            <div className="col-auto">
                <FormCheck type="checkbox" label="Filter Inactive" checked={filterInactive} onChange={toggleHandler}/>
            </div>
            <div className="col-auto">
                <div className="input-group input-group-sm">
                    <div className="input-group-text">
                        <span className="bi-funnel-fill" title="filter colors"/>
                    </div>
                    <input type="search" onChange={changeHandler} value={filter}
                           className="form-control form-control-sm"/>
                </div>
            </div>
            <div className="col-auto">
                <SpinnerButton type="button" color="outline-primary" spinning={loading} size="sm"
                               onClick={() => dispatch(loadColors())}>
                    Reload
                </SpinnerButton>
            </div>
        </div>
    )
}

export default ColorFilterBar;
