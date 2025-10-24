import React, {type ChangeEvent} from "react";
import FormCheck from "react-bootstrap/FormCheck";
import {loadColors, setColorFilter, toggleFilterInactiveColors} from "@/ducks/colors/actions";
import {selectColorFilter, selectColorsFilterInactive, selectColorsLoading} from "@/ducks/colors/selectors";
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";


const ColorFilterBar: React.FC = () => {
    const dispatch = useAppDispatch();
    const loading = useAppSelector(selectColorsLoading);
    const filter = useAppSelector(selectColorFilter);
    const filterInactive = useAppSelector(selectColorsFilterInactive);

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
                <Button type="button" color="outline-primary" size="sm"
                        onClick={() => dispatch(loadColors())}>
                    {loading && <Spinner size="sm" as="span" role="status" aria-hidden="true"/>}
                    Reload
                </Button>
            </div>
        </div>
    )
}

export default ColorFilterBar;
