import React from 'react';
import {ProgressBar} from "react-bootstrap";
import {useSelector} from "react-redux";
import {selectProductListLoading} from "../../../ducks/products/list/selectors";

export default function ProductsLoading() {
    const loading = useSelector(selectProductListLoading);

    return (
        <div style={{height: '5px'}} className="mb-1">
            {loading && (
                <ProgressBar striped animated now={loading ? 100 : 0} style={{height: '100%'}}/>
            )}
        </div>
    )
}
