import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {
    addPageSetAction,
    ConnectedPager,
    ConnectedTable,
    setPageAction,
    SortableTableField, SorterProps,
    tableAddedAction
} from "chums-connected-components";
import {productListTableKey, selectFilteredProductsListLength, selectSortedProductList} from "../selectors";
import {ProductListItem} from "b2b-types";
import {loadProductAction, loadProductListAction} from "../actions";
import {loadSeasonsAction} from "../../seasons";
import SeasonIcon from "../../seasons/SeasonIcon";
import ProductSellAsIcon from "./ProductSellAsIcon";
import classNames from "classnames";
import ProductRedirectIcon from "./ProductRedirectIcon";
import ProductPrice from "./ProductPrice";
import {LocalStore, storeProductListRowsPerPage} from "../../../localStore";
import {useAppDispatch} from "../../../app/hooks";

const defaultSort:SorterProps = {
    field: 'id',
    ascending: true,
}

interface ProductTableField extends SortableTableField {
    field: keyof ProductListItem,
}

const fields: ProductTableField[] = [
    {field: 'id', title: 'ID', sortable: true},
    {field: 'keyword', title: 'Keyword', sortable: true},
    {field: 'itemCode', title: 'Item Code', sortable: true},
    {field: 'name', title: 'Name', sortable: true},
    {field: 'season_code', title: 'Season', sortable: true, render: (row) => <SeasonIcon code={row.season_code}/>},
    {
        field: 'defaultParentProductsId',
        title: 'Parent ID',
        sortable: true,
        render: (row: ProductListItem) => <ProductRedirectIcon product={row}/>
    },
    {field: 'sellAs', title: 'Sell As', render: (row) => <ProductSellAsIcon product={row}/>},
    {
        field: 'minPrice',
        title: 'Price',
        render: (row: ProductListItem) => <ProductPrice product={row}/>,
        className: 'text-end'
    }
]

const rowClassName = (row: ProductListItem) => {
    return classNames({
        'text-danger': !row.status,
        'text-success': row.redirectToParent && !!row.defaultParentProductsId
    })
}
const ProductTable: React.FC = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const rowsPerPage = LocalStore.getItem(storeProductListRowsPerPage) || 25;
        dispatch(tableAddedAction({key: productListTableKey, field: 'id', ascending: true}));
        dispatch(addPageSetAction({key: productListTableKey, rowsPerPage}));
        dispatch(loadProductListAction());
        dispatch(loadSeasonsAction())
    }, [])


    const list = useSelector(selectSortedProductList);
    const length = useSelector(selectFilteredProductsListLength);

    const onChangeRowsPerPage = (value: number) => {
        LocalStore.setItem(storeProductListRowsPerPage, value);
        dispatch(setPageAction({key: productListTableKey, page: 1}));
    }

    const onSelectRow = (row: ProductListItem) => {
        dispatch(loadProductAction(row.keyword));
    }

    return (
        <div>
            <ConnectedTable tableKey={productListTableKey} defaultSort={defaultSort}
                            keyField={"id"} fields={fields} data={list} size="xs"
                            rowClassName={rowClassName} onSelectRow={onSelectRow}/>
            <ConnectedPager pageSetKey={productListTableKey} dataLength={length}
                            onChangeRowsPerPage={onChangeRowsPerPage}/>
        </div>
    )
}

export default ProductTable;
