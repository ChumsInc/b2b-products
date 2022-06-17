import React, {ChangeEvent} from "react";
import {useDispatch, useSelector} from "react-redux";

import {SpinnerButton} from "chums-ducks";
import {loadColorsAction, setColorFilterAction} from "./actions";
import {selectColorFilter, selectColorsLoading} from "./selectors";
import Debug from "debug";
const debug = Debug('chums:src:ducks:colors:ColorFilterBar');

const ColorFilterBar: React.FC = () => {
    const dispatch = useDispatch();
    const loading = useSelector(selectColorsLoading);
    const filter = useSelector(selectColorFilter);

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(setColorFilterAction(ev.target.value));
    }

    return (
        <div className="row g-3 align-items-baseline">
            <h2 className="col">Color List</h2>
            <div className="col-auto">
                <input type="search" onChange={changeHandler} value={filter} className="form-control form-control-sm"/>
            </div>
            <div className="col-auto">
                <SpinnerButton type="button" color="outline-primary" spinning={loading} size="sm"
                               onClick={() => dispatch(loadColorsAction())}>
                    Reload
                </SpinnerButton>
            </div>
        </div>
    )
}

export default ColorFilterBar;
