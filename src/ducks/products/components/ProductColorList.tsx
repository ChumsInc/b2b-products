import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {selectCurrentColorItem, selectCurrentProduct, selectCurrentProductColors} from "../selectors";
import ProductImage from "../../../app/ProductImage";
import {ProductColorItem} from "b2b-types/src/products";
import {calcPages, filterPage, FormCheck, Pagination, RowsPerPage} from "chums-components";
import classNames from "classnames";
import {setCurrentColorItemAction} from "../actions";
import {LocalStore, storeProductItemsRowsPerPage} from "../../../localStore";
import {useAppDispatch} from "../../../app/hooks";


const ProductColorList: React.FC = () => {
    const dispatch = useAppDispatch();
    const list = useSelector(selectCurrentProductColors);
    const product = useSelector(selectCurrentProduct);
    const selected = useSelector(selectCurrentColorItem);

    const selectItemHandler = (item: ProductColorItem) => dispatch(setCurrentColorItemAction(item));

    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(25);

    useEffect(() => {
        const rowsPerPage = LocalStore.getItem(storeProductItemsRowsPerPage) || 25;
        setRowsPerPage(rowsPerPage);
    }, [])

    const [checked, setChecked] = useState(true);
    const [filteredList, setFilteredList] = useState<ProductColorItem[]>(list.filter(row => !checked || row.status))
    const [pagedList, setPagedList] = useState<ProductColorItem[]>(filteredList.filter(filterPage(page, rowsPerPage)));

    useEffect(() => {
        setFilteredList(list.filter(row => !checked || row.status));
        setPagedList(list.filter(row => !checked || row.status).filter(filterPage(1, rowsPerPage)));
        setPage(1);
    }, [product.id]);

    useEffect(() => {
        const _list = list.filter(row => !checked || row.status);
        const nextPage = calcPages(_list.length, rowsPerPage) < page ? 1 : page;
        setFilteredList(_list);
        setPagedList(_list.filter(filterPage(nextPage, rowsPerPage)));
        setPage(nextPage);
    }, [list, checked, rowsPerPage]);

    useEffect(() => {
        setPagedList(filteredList.filter(filterPage(page, rowsPerPage)));
    }, [rowsPerPage, page]);

    const onChangeRowsPerPage = (value: number) => {
        LocalStore.setItem(storeProductItemsRowsPerPage, value);
        setRowsPerPage(value);
    }
    return (
        <>
            <div className="row g-3">
                <div className="col-auto">
                    <RowsPerPage value={rowsPerPage} onChange={onChangeRowsPerPage}/>
                </div>
                <div className="col-auto">
                    <FormCheck label="Filter Inactive" checked={checked}
                               onChange={() => setChecked(!checked)} type="checkbox"/>
                </div>
                <div className="col-auto">
                    <Pagination page={page} pages={calcPages(filteredList.length, rowsPerPage)} onSelectPage={setPage}
                                filtered={list.length !== filteredList.length}/>
                </div>
            </div>
            <div className="product-color-list">
                {pagedList.map(item => (
                    <div key={item.id} className="product-color-item">
                        <button type="button" className={classNames('btn btn-sm', {
                            'btn-secondary': selected.id === item.id,
                            'btn-outline-secondary': selected.id !== item.id
                        })} onClick={() => selectItemHandler(item)}>
                            {item.colorCode}
                        </button>
                        <ProductImage filename={item.additionalData?.image_filename || product.image}
                                      className={classNames({'text-danger': !item.status})}
                                      colorCode={item.colorCode} itemCode={item.itemCode} size={80}/>
                    </div>
                ))}
            </div>
        </>
    )
}
export default ProductColorList
