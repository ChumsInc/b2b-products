import {type TableHTMLAttributes} from 'react';
import BomDetailRow from "@/components/products/mix/BomDetailRow";
import {useAppSelector} from "@/app/configureStore";
import {selectCurrentMixBOMDetail} from "@/ducks/products/productMixBOMSlice";
import type {BOMComponent} from "@/types/item-search";

export interface BOMDetailTableProps extends Omit<TableHTMLAttributes<HTMLTableElement>, 'onClick'> {
    onClick?: (item: BOMComponent) => void;
}

export default function BOMDetailTable({
                                           onClick,
                                           ...rest
                                       }: BOMDetailTableProps) {
    const detail = useAppSelector(selectCurrentMixBOMDetail);

    const clickHandler = (item: BOMComponent) => {
        if (onClick) {
            onClick(item);
        }
    }

    return (
        <table className="table table-xs table-hover" {...rest}>
            <thead>
            <tr>
                <th>Item</th>
                <th>Description</th>
                <th className="text-end">Quantity Per Bill</th>
            </tr>
            </thead>
            <tbody>
            {detail.map(row => (
                <BomDetailRow key={row.LineSeqNo} item={row}
                              onClick={onClick ? () => clickHandler(row) : undefined}/>
            ))}
            </tbody>
        </table>
    )
}
