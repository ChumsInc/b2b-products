import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {SortableTable, SortableTableField, SortProps, TablePagination} from "@chumsinc/sortable-tables";
import {ProductListItem} from "b2b-types";
import SeasonIcon from "../../season/SeasonIcon";
import ProductSellAsIcon from "./ProductSellAsIcon";
import classNames from "classnames";
import ProductRedirectIcon from "../product/ProductRedirectIcon";
import ProductPrice from "./ProductPrice";
import {setProductsSort} from "../../../ducks/products/list/actions";
import {useAppDispatch} from "../../app/hooks";
import {selectFilteredList, selectProductListSort} from "../../../ducks/products/list/selectors";
import {selectCurrentProductId} from "../../../ducks/products/product/selectors";
import ProductTableCategoryName from "./ProductTableCategoryName";
import {useNavigate} from "react-router";
import {localStorageKeys} from "../../../api/preferences";
import {LocalStore} from "chums-ui-utils";


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
        title: 'Parent',
        sortable: true,
        render: (row: ProductListItem) => <ProductRedirectIcon product={row}/>
    },
    {field: 'sellAs', title: 'Sell As', render: (row) => <ProductSellAsIcon product={row} showStatusIcon/>},
]

const rowClassName = (row: ProductListItem) => {
    return classNames({
        'table-danger': !row.status,
    })
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
        setPage(0);
    }, [list, currentId, rowsPerPage]);

    const rowsPerPageChangeHandler = (rpp: number) => {
        LocalStore.setItem<number>(localStorageKeys.products.rowsPerPage, rpp)
        setPage(0);
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
            <SortableTable currentSort={sort} onChangeSort={sortChangeHandler}
                           keyField={"id"} fields={fields}
                           data={list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)} size="xs"
                           selected={(row) => row.id === currentId}
                           rowClassName={rowClassName} onSelectRow={onSelectRow}/>
            <TablePagination size="sm" page={page} onChangePage={setPage}
                             rowsPerPage={rowsPerPage} rowsPerPageProps={{onChange: rowsPerPageChangeHandler}}
                             showFirst showLast
                             count={list.length}/>
        </div>
    )
}

export default ProductTable;
