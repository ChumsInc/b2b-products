import {useEffect, useState} from "react";
import {SortableTable, type SortableTableField, type SortProps, TablePagination} from "@chumsinc/sortable-tables";
import type {ProductListItem} from "b2b-types";
import SeasonIcon from "../../season/SeasonIcon";
import ProductSellAsIcon from "./ProductSellAsIcon";
import classNames from "classnames";
import ProductRedirectIcon from "../product/ProductRedirectIcon";
import {selectFilteredList, selectProductListSort, setProductsSort} from "@/ducks/productList/productListSlice.ts";
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {selectCurrentProductId} from "@/ducks/products/productSlice.ts";
import ProductTableCategoryName from "./ProductTableCategoryName";
import {useNavigate} from "react-router";
import {localStorageKeys} from "@/src/api/preferences";
import {LocalStore} from "chums-ui-utils";
import {ErrorBoundary} from "react-error-boundary";
import ErrorFallbackComponent from "@/components/app/ErrorFallbackComponent";


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
    const sort = useAppSelector(selectProductListSort);
    const list = useAppSelector(selectFilteredList);
    const currentId = useAppSelector(selectCurrentProductId);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(
        LocalStore.getItem<number>(localStorageKeys.products.rowsPerPage, 25) ?? 25
    );

    useEffect(() => {
        setPage(0);
    }, [list.length, rowsPerPage]);

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
        <ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
            <SortableTable currentSort={sort} onChangeSort={sortChangeHandler}
                           keyField={"id"} fields={fields}
                           data={list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)} size="xs"
                           selected={(row) => row.id === currentId}
                           rowClassName={rowClassName} onSelectRow={onSelectRow}/>
            <TablePagination size="sm" page={page} onChangePage={setPage}
                             rowsPerPage={rowsPerPage} rowsPerPageProps={{onChange: rowsPerPageChangeHandler}}
                             showFirst showLast
                             count={list.length}/>
        </ErrorBoundary>
    )
}

export default ProductTable;
