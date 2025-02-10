import React, {useEffect, useId, useState} from "react";
import {useSelector} from "react-redux";
import {selectCurrentColor, selectWhereUsed} from "../../ducks/colors/selectors";
import {loadColorUsage} from "../../ducks/colors/actions";
import ProductImage from "../app/ProductImage";
import {ColorProductUsage} from "b2b-types";
import {TablePagination} from "sortable-tables";
import {useAppDispatch} from "../app/hooks";
import {FormCheck} from "react-bootstrap";


const ColorUsageList: React.FC = () => {
    const dispatch = useAppDispatch();
    const selected = useSelector(selectCurrentColor);
    const whereUsed = useSelector(selectWhereUsed);
    const id = useId();

    const [list, setList] = useState<ColorProductUsage[]>([]);
    const [pagedList, setPagedList] = useState<ColorProductUsage[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [checked, setChecked] = useState(true);

    useEffect(() => {
        if (selected?.id) {
            dispatch(loadColorUsage(selected?.id));
        }
    }, [selected?.id]);

    useEffect(() => {
        const page = 0;
        setPage(0);
        const list = whereUsed.filter(row => !checked || row.status);
        setList(list);
        setPagedList(list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage));
    }, [whereUsed, checked]);

    useEffect(() => {
        setPagedList(list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage));
    }, [rowsPerPage, page]);

    useEffect(() => {
        const page = 0;
        setPage(0);
        setPagedList(list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage));
    }, [rowsPerPage]);

    return (
        <div>
            <h3>Color Usage</h3>
            <div className="row g-3 align-items-baseline">
                <div className="col-auto">
                    <FormCheck type="checkbox" label="Filter Inactive" checked={checked} id={id}
                               onChange={() => setChecked(!checked)}/>
                </div>
                <div className="col-auto">
                    <TablePagination size="sm" page={page} onChangePage={setPage} rowsPerPage={rowsPerPage}
                                     rowsPerPageProps={{onChange: setRowsPerPage}}
                                     count={list.length}/>
                </div>
            </div>
            <div className="d-flex flex-wrap justify-content-start">
                {!!selected && pagedList.map(c => (
                    <ProductImage key={c.productId} filename={c.image} itemCode={c.itemCode}
                                  colorCode={selected.code} size={80} className="p-1"/>
                ))}
            </div>
        </div>

    )
}

export default ColorUsageList;
