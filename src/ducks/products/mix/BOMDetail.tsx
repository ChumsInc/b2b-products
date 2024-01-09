import React from 'react';
import {useAppSelector} from "../../../app/hooks";
import {selectCurrentMixBOMDetail, selectCurrentMixBOMHeader} from "./selectors";
import dayjs from "dayjs";

const BOMDetail = () => {
    const header = useAppSelector(selectCurrentMixBOMHeader);
    const detail = useAppSelector(selectCurrentMixBOMDetail);

    if (!header) {
        return null;
    }
    return (
        <div>
            <div className="row g-3">
                <div className="col-12 col-md-6">
                    <h4>BOM Detail</h4>
                    <div className="text-muted"><small>{header.BillDesc1}</small></div>
                    <div className="text-muted"><small>{header.BillDesc2}</small></div>
                    <div className="text-muted">Sales UM: <strong>{header.SalesUnitOfMeasure}</strong></div>
                    <div className="text-muted">
                        Last Updated: <strong>{dayjs(header.DateUpdated).format('YYYY-MM-DD')}</strong>
                    </div>
                </div>
                <div className="col-12 col-md-6">
                    <table className="table table-xs table-hover">
                        <thead>
                        <tr>
                            <th>Item</th>
                            <th>Description</th>
                            <th className="text-end">Quantity Per Bill</th>
                        </tr>
                        </thead>
                        <tbody>
                        {detail.map(row => (
                            <tr key={row.LineSeqNo}>
                                <td>{row.ComponentItemCode}</td>
                                <td>{row.ComponentDesc}</td>
                                <td className="text-end">{row.QuantityPerBill}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default BOMDetail;
