import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {SortableTable, SortableTableField, TablePagination} from 'chums-components';
import {ProductColor} from "b2b-types";
import {setCurrentColorByCode, setSort} from "./actions";
import {selectCurrentColor, selectSort, selectSortedList} from "./selectors";
import {useAppDispatch} from "../../app/hooks";
import ColorFilterBar from "./ColorFilterBar";
import classNames from "classnames";
import {useNavigate, useParams} from "react-router";
import {getPreference, localStorageKeys, setPreference} from "../../api/preferences";


const colorFields: SortableTableField<ProductColor>[] = [
    {field: 'id', title: 'ID', sortable: true, className: 'text-end'},
    {field: 'code', title: 'Color Code', sortable: true},
    {field: 'name', title: 'Color Name', sortable: true},
    // {field: 'swatchCode', title: 'Swatch Code', sortable: true},
];

const rowClassName = (row: ProductColor) => {
    return classNames({
        'text-danger': row.active === false,
        'text-warning': row.active === null,
    })
}


const ColorList: React.FC = () => {
    const dispatch = useAppDispatch();
    const selected = useSelector(selectCurrentColor);
    const list = useSelector(selectSortedList);
    const sort = useSelector(selectSort);
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(getPreference(localStorageKeys.colors.rowsPerPage, 25));
    const params = useParams<{ code: string }>();

    useEffect(() => {
        setCurrentColorByCode(params.code);
    }, [params.code]);

    useEffect(() => {
        setPage(0);
    }, [sort, list]);

    const onSelectColor = (color: ProductColor) => {
        const url = `/colors/${color.code}`;
        navigate(url);
    }

    const rowsPerPageChangeHandler = (rpp: number) => {
        setPreference(localStorageKeys.colors.rowsPerPage, rpp);
        setPage(0);
        setRowsPerPage(rpp);
    }

    const pagedList = list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    return (
        <div>
            <ColorFilterBar/>
            <SortableTable keyField={'id'}
                           currentSort={sort} onChangeSort={(sort) => dispatch(setSort(sort))}
                           fields={colorFields} size="xs"
                           selected={(color) => color.id === selected?.id}
                           rowClassName={rowClassName}
                           onSelectRow={onSelectColor}
                           data={pagedList}/>
            <TablePagination page={page} onChangePage={setPage} bsSize="sm"
                             rowsPerPage={rowsPerPage} onChangeRowsPerPage={rowsPerPageChangeHandler}
                             showFirst showLast
                             count={list.length}/>
        </div>
    )

}

export default React.memo(ColorList);

