import React, {ChangeEvent} from 'react';
import {useSelector} from "react-redux";
import {
    productListTableKey,
    selectCurrentProductChanged,
    selectProductListLoading,
    selectProductsFilterActive,
    selectProductsFilterAvailable,
    selectProductsFilterOnSale,
    selectProductsSearch
} from "../selectors";
import {
    loadProductListAction,
    setFilterActiveAction,
    setFilterAvailableAction,
    setFilterOnSaleAction,
    setNewCurrentProductAction,
    setProductsSearchAction
} from "../actions";
import {FormCheck, SpinnerButton} from "chums-components";
import {setPageAction} from "chums-connected-components";
import {useAppDispatch} from "../../../app/hooks";

const ProductTableFilterBar: React.FC = () => {
    const dispatch = useAppDispatch();
    const filterActive = useSelector(selectProductsFilterActive);
    const filterOnSale = useSelector(selectProductsFilterOnSale);
    const filterAvailable = useSelector(selectProductsFilterAvailable);
    const search = useSelector(selectProductsSearch);
    const loading = useSelector(selectProductListLoading);
    const changed = useSelector(selectCurrentProductChanged);

    const searchChangeHandler = (ev: ChangeEvent<HTMLInputElement>) => dispatch(setProductsSearchAction(ev.target.value));
    const filterActiveClickHandler = () => {
        dispatch(setFilterActiveAction(!filterActive));
        dispatch(setPageAction({key: productListTableKey, page: 1}));
    }
    const filterOnSaleClickHandler = () => {
        dispatch(setFilterOnSaleAction(!filterOnSale));
        dispatch(setPageAction({key: productListTableKey, page: 1}));
    }
    const filterAvailableClickHandler = () => {
        dispatch(setFilterAvailableAction(!filterAvailable));
        dispatch(setPageAction({key: productListTableKey, page: 1}));
    }

    const newProductHandler = () => {
        if (!changed || window.confirm('Are you sure you want to discard your changes?')) {
            dispatch(setNewCurrentProductAction());
        }
    }

    const reloadHandler = () => dispatch(loadProductListAction());

    return (
        <div className="row g-3 align-items-baseline">
            <div className="col-auto">
                <div className="input-group input-group-sm">
                    <span className="input-group-text bi-search"/>
                    <input type="search" className="form-control form-control-sm"
                           value={search} onChange={searchChangeHandler}/>
                </div>
            </div>
            <div className="col-auto">
                <FormCheck label="Filter Active" checked={filterActive} onClick={filterActiveClickHandler}
                           type={"checkbox"}/>
            </div>
            <div className="col-auto">
                <FormCheck label="Filter On Sale" checked={filterOnSale} onClick={filterOnSaleClickHandler}
                           type={"checkbox"}/>
            </div>
            <div className="col-auto">
                <FormCheck label="Filter Available" checked={filterAvailable} onClick={filterAvailableClickHandler}
                           type={"checkbox"}/>
            </div>
            <div className="col-auto">
                <SpinnerButton spinning={loading} type="button" onClick={reloadHandler} size="sm">Reload</SpinnerButton>
            </div>
            <div className="col-auto">
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={newProductHandler}>New
                    Product
                </button>
            </div>
        </div>
    )
}

export default ProductTableFilterBar;
