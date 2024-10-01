import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {LocalStore, SortableTable, SortableTableField, SortProps, TablePagination} from "chums-components";
import {ProductListItem} from "b2b-types";
import SeasonIcon from "../../season/SeasonIcon";
import ProductSellAsIcon from "./ProductSellAsIcon";
import classNames from "classnames";
import ProductRedirectIcon from "../product/ProductRedirectIcon";
import ProductPrice from "./ProductPrice";
import {setProductsSort} from "../../../ducks/products/list/actions";
import {useAppDispatch} from "../../app/hooks";
import ProductTableFilterBar from "./ProductTableFilterBar";
import {selectFilteredList, selectProductListSort} from "../../../ducks/products/list/selectors";
import {selectCurrentProductId} from "../../../ducks/products/product/selectors";
import ProductTableCategoryName from "./ProductTableCategoryName";
import {useNavigate} from "react-router";
import {localStorageKeys} from "../../../api/preferences";


const fields: SortableTableField<ProductListItem>[] = [
    {field: 'id', title: 'ID', sortable: true},
    {field: 'keyword', title: 'Keyword', sortable: true},
    {field: 'itemCode', title: 'Item Code', sortable: true},
    {field: 'name', title: 'Name', sortable: true},
    {
        field: 'defaultCategoriesId',
        title: 'Category',
        render: (row) => <ProductTableCategoryName categoryId={row.defaultCategoriesId}/>
    },
    {
        field: 'season_code',
        title: 'Season',
        sortable: true,
        render: (row) => <SeasonIcon code={row.season_code} seasonAvailable={row.seasonAvailable}/>
    },
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

const findProductPage = (list: ProductListItem[], id: number, rowsPerPage: number): number => {
    const index = list.map(item => item.id).indexOf(id);
    return index === -1 || !rowsPerPage
        ? 0
        : Math.floor(index / rowsPerPage);
}

const ProductTable = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const sort = useSelector(selectProductListSort);
    const list = useSelector(selectFilteredList);
    const currentId = useSelector(selectCurrentProductId);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(
        LocalStore.getItem<number>(localStorageKeys.products.rowsPerPage, 25) ?? 25
    );

    useEffect(() => {
        setPage(findProductPage(list, currentId, rowsPerPage));
    }, [list, currentId, rowsPerPage]);

    const rowsPerPageChangeHandler = (rpp: number) => {
        LocalStore.setItem<number>(localStorageKeys.products.rowsPerPage, rpp)
        setPage(findProductPage(list, currentId, rpp));
        setRowsPerPage(rpp);
    }
    const onSelectRow = (row: ProductListItem) => {
        const url = `/products/${encodeURIComponent(row.keyword)}`;
        navigate(url);
    }

    const sortChangeHandler = (sort: SortProps<ProductListItem>) => {
        dispatch(setProductsSort(sort));
    }

    return (
        <div>
            <ProductTableFilterBar/>
            <SortableTable currentSort={sort} onChangeSort={sortChangeHandler}
                           keyField={"id"} fields={fields}
                           data={list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)} size="xs"
                           selected={(row) => row.id === currentId}
                           rowClassName={rowClassName} onSelectRow={onSelectRow}/>
            <TablePagination page={page} onChangePage={setPage}
                             rowsPerPage={rowsPerPage} onChangeRowsPerPage={rowsPerPageChangeHandler}
                             showFirst showLast
                             count={list.length}/>
        </div>
    )
}

export default ProductTable;
