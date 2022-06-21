import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectCurrentColor, selectWhereUsed} from "./selectors";
import {loadColorUsageAction} from "./actions";
import ProductImage from "../../app/ProductImage";
import {ColorProductUsage} from "b2b-types";
import {calcPages, filterPage, FormCheck, Pagination, RowsPerPage} from "chums-components";
import {useAppDispatch} from "../../app/hooks";

const ColorUsageList: React.FC = () => {
    const dispatch = useAppDispatch();
    const selected = useSelector(selectCurrentColor);
    const whereUsed = useSelector(selectWhereUsed);

    const [list, setList] = useState<ColorProductUsage[]>([]);
    const [pagedList, setPagedList] = useState<ColorProductUsage[]>([]);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [checked, setChecked] = useState(true);

    useEffect(() => {
        if (selected.id) {
            dispatch(loadColorUsageAction(selected.id));
        }
    }, [selected.id]);

    useEffect(() => {
        setList(whereUsed.filter(row => !checked || row.status));
        setPagedList(whereUsed.filter(row => !checked || row.status).filter(filterPage(page, rowsPerPage)));
    }, [whereUsed, checked]);

    useEffect(() => {
        setPagedList(list.filter(row => !checked || row.status).filter(filterPage(page, rowsPerPage)));
    }, [rowsPerPage, page]);

    return (
        <div>
            <h3>Color Usage</h3>
            <div className="row g-3">
                <div className="col-auto">
                    <RowsPerPage value={rowsPerPage} onChange={setRowsPerPage}/>
                </div>
                <div className="col-auto">
                    <FormCheck label="Filter Inactive" checked={checked}
                               onClick={() => setChecked(!checked)} type="checkbox"/>
                </div>
                <div className="col-auto">
                    <Pagination page={page} pages={calcPages(list.length, rowsPerPage)} onSelectPage={setPage}
                                filtered={list.length !== whereUsed.length}/>
                </div>
            </div>
            <div className="d-flex flex-wrap justify-content-start">
                {pagedList.map(c => (
                    <ProductImage key={c.productId} filename={c.image} itemCode={c.itemCode}
                                  colorCode={selected.code} size={80} className="p-1"/>
                ))}
            </div>
        </div>

    )
}

export default ColorUsageList;
