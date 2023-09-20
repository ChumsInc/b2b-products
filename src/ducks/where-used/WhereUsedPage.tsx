import React, {FormEvent, useEffect, useId, useState} from 'react';
import {useAppDispatch} from "../../app/hooks";
import {useSelector} from "react-redux";
import {loadWhereUsed, selectWhereUsedLoading, selectWhereUsedSearch} from "./index";
import {LinearProgress} from "@mui/material";
import WhereUsedProducts from "./WhereUsedProducts";
import WhereUsedCategories from "./WhereUsedCategories";

const WhereUsedPage = () => {
    const dispatch = useAppDispatch();
    const search = useSelector(selectWhereUsedSearch);
    const loading = useSelector(selectWhereUsedLoading);
    const id = useId();
    const [value, setValue] = useState<string>(search);

    useEffect(() => {
        setValue(search);
    }, [search]);

    const submitHandler = (ev: FormEvent) => {
        ev.preventDefault();
        dispatch(loadWhereUsed(value));
    }

    return (
        <div className="container">
            <form className="row g-3" onSubmit={submitHandler}>
                <div className="col-auto">
                    <label htmlFor={id}>Item Code</label></div>
                <div className="col-auto">
                    <input type="search" className="form-control form-control-sm" value={value}
                           onChange={(ev) => setValue(ev.target.value)}/>
                </div>
                <div className="col-auto">
                    <button type="submit" className="btn btn-sm btn-primary" disabled={loading}>Load</button>
                </div>
            </form>
            <div className="mb-3">
                {loading && <LinearProgress variant="indeterminate"/>}
            </div>
            <div className="row g-3">
                <div className="col">
                    <h3>Products</h3>
                    <WhereUsedProducts />
                </div>
                <div className="col">
                    <h3>Category Pages</h3>
                    <WhereUsedCategories />
                </div>
            </div>
        </div>
    )
}

export default WhereUsedPage;
