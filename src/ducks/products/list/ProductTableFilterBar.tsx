import React, {ChangeEvent} from 'react';
import {useSelector} from "react-redux";
import {
    selectProductListLoading, selectProductSeasonFilter,
    selectProductsFilterActive,
    selectProductsFilterAvailable,
    selectProductsFilterCategoryId,
    selectProductsFilterOnSale,
    selectProductsSearch
} from "./selectors";
import {FormCheck, SpinnerButton} from "chums-components";
import {
    loadProductsList,
    setCategoryFilter,
    setProductsSearch, setSeasonFilter,
    toggleFilterActive,
    toggleFilterAvailable,
    toggleFilterOnSale
} from "./actions";
import {useAppDispatch} from "../../../app/hooks";
import {Keyword} from "b2b-types";
import KeywordSelect from "../../keywords/KeywordSelect";
import {loadKeywords} from "../../keywords";
import {loadColors} from "../../colors/actions";
import {loadSeasons} from "../../seasons";
import {reloadSwatchCSSFile} from "../../../utils";
import SeasonSelect from "../../seasons/SeasonSelect";

const ProductTableFilterBar: React.FC = () => {
    const dispatch = useAppDispatch();
    const filterActive = useSelector(selectProductsFilterActive);
    const filterOnSale = useSelector(selectProductsFilterOnSale);
    const filterAvailable = useSelector(selectProductsFilterAvailable);
    const search = useSelector(selectProductsSearch);
    const loading = useSelector(selectProductListLoading);
    const categoryId = useSelector(selectProductsFilterCategoryId);
    const season = useSelector(selectProductSeasonFilter);

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

    const reloadHandler = () => {
        dispatch(loadProductsList());
        dispatch(loadKeywords())
        dispatch(loadColors());
        dispatch(loadSeasons());
        reloadSwatchCSSFile();
    }

    return (
        <div className="row g-3 align-items-baseline">
            <div className="col">
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
            <div className="col-auto">
                <div className="input-group input-group-sm">
                    <label className="input-group-text">Season</label>
                    <SeasonSelect value={season} onChange={(season) => dispatch(setSeasonFilter(season?.code ?? ''))} />
                </div>
            </div>
            <div className="col-auto">
                <div className="input-group input-group-sm">
                    <div className="input-group-text">Category</div>
                    <KeywordSelect pageType="category" value={categoryId ?? ''} style={{maxWidth: '15rem'}}
                                   onSelectKeyword={filterCategoryChangeHandler}/>
                </div>
            </div>
            <div className="col-auto">
                <SpinnerButton spinning={loading} type="button" onClick={reloadHandler} size="sm">Reload</SpinnerButton>
            </div>
        </div>
    )
}

export default ProductTableFilterBar;
