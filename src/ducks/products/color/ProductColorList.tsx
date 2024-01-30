import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {selectCurrentColorItem, selectCurrentProductColors} from "./selectors";
import {selectCurrentProduct} from "../product/selectors";
import ProductImage from "../../../app/ProductImage";
import {ProductColorItem} from "b2b-types/src/products";
import {FormCheck, TablePagination} from "chums-components";
import classNames from "classnames";
import {LocalStore, storeProductItemsRowsPerPage} from "../../../localStore";
import {useAppDispatch} from "../../../app/hooks";
import {setCurrentColorItem} from "./actions";
import SeasonIcon from "../../seasons/SeasonIcon";


const ProductColorList = () => {
    const dispatch = useAppDispatch();
    const list = useSelector(selectCurrentProductColors);
    const product = useSelector(selectCurrentProduct);
    const selected = useSelector(selectCurrentColorItem);

    const selectItemHandler = (item: ProductColorItem) => dispatch(setCurrentColorItem(item));

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);

    useEffect(() => {
        const rowsPerPage = LocalStore.getItem(storeProductItemsRowsPerPage) || 25;
        setRowsPerPage(rowsPerPage);
    }, [])

    const [showInactive, setShowInactive] = useState(false);
    const [filteredList, setFilteredList] = useState<ProductColorItem[]>(list.filter(row => showInactive || row.selfStatus))

    useEffect(() => {
        const filteredList = list.filter(row => showInactive || row.selfStatus);
        setFilteredList(filteredList);
        setPage(1);
    }, [product?.id]);

    useEffect(() => {
        const filteredList = list.filter(row => showInactive || row.selfStatus);
        const nextPage = Math.floor(filteredList.length / rowsPerPage) < page ? 0 : page;
        setFilteredList(filteredList);
        setPage(nextPage);
    }, [list, showInactive, rowsPerPage]);

    const onChangeRowsPerPage = (value: number) => {
        LocalStore.setItem(storeProductItemsRowsPerPage, value);
        setRowsPerPage(value);
    }

    if (!product) {
        return null;
    }
    return (
        <>
            <div className="row g-3 align-items-baseline">
                <div className="col-auto">
                    <FormCheck label="Show Inactive" checked={showInactive}
                               onChange={() => setShowInactive(!showInactive)} type="checkbox"/>
                </div>
                <div className="col">
                    <TablePagination bsSize="sm"
                                     page={page} onChangePage={setPage}
                                     rowsPerPage={rowsPerPage} onChangeRowsPerPage={onChangeRowsPerPage}
                                     count={filteredList.length}/>
                </div>
            </div>
            <div className="product-color-list">
                {filteredList
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(item => (
                        <div key={item.id} className="product-color-item">
                            <button type="button" className={classNames('btn btn-sm', {
                                'btn-secondary': selected?.id === item.id,
                                'btn-outline-secondary': selected?.id !== item.id
                            })} onClick={() => selectItemHandler(item)}>
                                {item.colorCode}
                            </button>
                            <ProductImage filename={item.additionalData?.image_filename || product?.image}
                                          className={classNames({'text-danger': !item.status})}
                                          colorCode={item.colorCode} itemCode={item.itemCode} size={80}/>
                            <SeasonIcon code={item.additionalData?.season?.code} />
                        </div>
                    ))}
            </div>
        </>
    )
}
export default ProductColorList;
