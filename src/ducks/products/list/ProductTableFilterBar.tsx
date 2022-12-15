import React, {ChangeEvent} from 'react';
import {useSelector} from "react-redux";
import {
    selectProductListLoading,
    selectProductsFilterActive,
    selectProductsFilterAvailable,
    selectProductsFilterCategoryId,
    selectProductsFilterOnSale,
    selectProductsSearch
} from "./selectors";
import {FormCheck, SpinnerButton} from "chums-components";
import {selectCurrentProductChanged} from "../product/selectors";
import {
    loadProductsList,
    setCategoryFilter,
    setProductsSearch,
    toggleFilterActive,
    toggleFilterAvailable,
    toggleFilterOnSale
} from "./actions";
import {useAppDispatch} from "../../../app/hooks";
import {Keyword} from "b2b-types";
import KeywordSelect from "../../keywords/KeywordSelect";

const ProductTableFilterBar: React.FC = () => {
    const dispatch = useAppDispatch();
    const filterActive = useSelector(selectProductsFilterActive);
    const filterOnSale = useSelector(selectProductsFilterOnSale);
    const filterAvailable = useSelector(selectProductsFilterAvailable);
    const search = useSelector(selectProductsSearch);
    const loading = useSelector(selectProductListLoading);
    const categoryId = useSelector(selectProductsFilterCategoryId);

    const searchChangeHandler = (ev: ChangeEvent<HTMLInputElement>) => dispatch(setProductsSearch(ev.target.value));
    const filterActiveClickHandler = () => {
        dispatch(toggleFilterActive(!filterActive));
    }
    const filterOnSaleClickHandler = () => {
        dispatch(toggleFilterOnSale(!filterOnSale));
    }
    const filterAvailableClickHandler = () => {
        dispatch(toggleFilterAvailable(!filterAvailable));
    }

    const filterCategoryChangeHandler = (kw: Keyword | null) => {
        dispatch(setCategoryFilter(kw?.id ?? null));
    }

    const reloadHandler = () => dispatch(loadProductsList());

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
                <FormCheck label="Active" checked={filterActive} onChange={filterActiveClickHandler}
                           type={"checkbox"}/>
            </div>
            <div className="col-auto">
                <FormCheck label="On Sale" checked={filterOnSale} onChange={filterOnSaleClickHandler}
                           type={"checkbox"}/>
            </div>
            <div className="col-auto">
                <FormCheck label="Available" checked={filterAvailable} onChange={filterAvailableClickHandler}
                           type={"checkbox"}/>
            </div>
            <div className="col">
                <KeywordSelect pageType="category" value={categoryId ?? ''}
                               onSelectKeyword={filterCategoryChangeHandler}/>
            </div>
            <div className="col-auto">
                <SpinnerButton spinning={loading} type="button" onClick={reloadHandler} size="sm">Reload</SpinnerButton>
            </div>
        </div>
    )
}

export default ProductTableFilterBar;
