import React from 'react';
import {useAppDispatch} from "../../../app/hooks";
import {useSelector} from "react-redux";
import {selectFilteredList, selectProductListPage, selectProductListRowsPerPage} from "./selectors";
import {TablePagination} from "chums-components";
import {setPage, setRowsPerPage} from "./actions";

const ProductTablePagination = () => {
    const dispatch = useAppDispatch();

    const page = useSelector(selectProductListPage);
    const rowsPerPage = useSelector(selectProductListRowsPerPage);
    const length = useSelector(selectFilteredList).length;

    return (
        <TablePagination page={page} onChangePage={(page) => dispatch(setPage(page))}
                         rowsPerPage={rowsPerPage} onChangeRowsPerPage={(rpp) => dispatch(setRowsPerPage(rpp))}
                         showFirst showLast
                         count={length}/>
    )
}

export default ProductTablePagination;
