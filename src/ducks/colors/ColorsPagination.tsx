import React from 'react';
import {useAppDispatch} from "../../app/hooks";
import {useSelector} from "react-redux";
import {selectFilteredListLength, selectPage, selectRowsPerPage} from "./selectors";
import {setPage, setRowsPerPage} from "./actions";
import {TablePagination} from "chums-components";

const ColorsPagination = () => {
    const dispatch = useAppDispatch();
    const page = useSelector(selectPage);
    const rowsPerPage = useSelector(selectRowsPerPage);
    const count = useSelector(selectFilteredListLength);

    const onChangePage = (page: number) => dispatch(setPage(page));
    const rowsPerPageChangeHandler = (rowsPerPage: number) => dispatch(setRowsPerPage(rowsPerPage));

    return (
        <TablePagination page={page} onChangePage={onChangePage}
                         rowsPerPage={rowsPerPage} onChangeRowsPerPage={rowsPerPageChangeHandler}
                         count={count}/>
    )
}
export default ColorsPagination;
