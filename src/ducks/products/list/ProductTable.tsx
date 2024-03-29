import React from "react";
import {useSelector} from "react-redux";
import {SortableTable, SortableTableField, SortProps} from "chums-components";
import {ProductListItem} from "b2b-types";
import SeasonIcon from "../../seasons/SeasonIcon";
import ProductSellAsIcon from "./ProductSellAsIcon";
import classNames from "classnames";
import ProductRedirectIcon from "../product/ProductRedirectIcon";
import ProductPrice from "./ProductPrice";

import {loadProduct} from "../product/actions";
import {setProductsSort} from "./actions";
import {useAppDispatch} from "../../../app/hooks";
import ProductTableFilterBar from "./ProductTableFilterBar";
import {selectPagedList, selectProductListSort} from "./selectors";
import {selectSort} from "../../colors/selectors";
import ProductTablePagination from "./ProductTablePagination";
import {selectCurrentProduct} from "../product/selectors";
import ProductTableCategoryName from "./ProductTableCategoryName";
import {useNavigate} from "react-router";


const fields: SortableTableField<ProductListItem>[] = [
    {field: 'id', title: 'ID', sortable: true},
    {field: 'keyword', title: 'Keyword', sortable: true},
    {field: 'itemCode', title: 'Item Code', sortable: true},
    {field: 'name', title: 'Name', sortable: true},
    {field: 'defaultCategoriesId', title: 'Category', render: (row) => <ProductTableCategoryName categoryId={row.defaultCategoriesId} />},
    {field: 'season_code', title: 'Season', sortable: true, render: (row) => <SeasonIcon code={row.season_code} seasonAvailable={row.seasonAvailable}/>},
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
    const navigate = useNavigate();
    const sort = useSelector(selectProductListSort);
    const pagedList = useSelector(selectPagedList);
    const current = useSelector(selectCurrentProduct);

    const onSelectRow = (row: ProductListItem) => {
        const url = `/products/${encodeURIComponent(row.keyword)}`;
        navigate(url);
    }

    const sortChangeHandler = (sort:SortProps<ProductListItem>) => {
        dispatch(setProductsSort(sort));
    }

    return (
        <div>
            <ProductTableFilterBar/>
            <SortableTable currentSort={sort} onChangeSort={sortChangeHandler}
                           keyField={"id"} fields={fields} data={pagedList} size="xs"
                           selected={(row) => row.id === current?.id}
                           rowClassName={rowClassName} onSelectRow={onSelectRow}/>
            <ProductTablePagination/>
        </div>
    )
}

export default ProductTable;
