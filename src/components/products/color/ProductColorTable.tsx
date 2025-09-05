import React from 'react';
import {useSelector} from "react-redux";
import {selectCurrentColorItem, selectCurrentColorSort} from "@/ducks/products/color/selectors";
import {ProductColorItem} from "b2b-types/src/products";
import SeasonIcon from "../../season/SeasonIcon";
import ColorSwatch from "../../colors/ColorSwatch";
import {SortableTable, SortableTableField} from "@chumsinc/sortable-tables";
import classNames from "classnames";
import {useAppDispatch, useAppSelector} from "@/components/app/hooks";
import {SortProps} from "chums-types";
import {setColorsSort} from "@/ducks/products/color/actions";
import ProductColorSwatch from "@/components/products/color/ProductColorSwatch";
import {Badge} from "react-bootstrap";


const fields: SortableTableField<ProductColorItem>[] = [
    {field: 'id', title: 'ID', className: 'text-secondary', sortable: true},
    {field: 'colorCode', title: 'Color', sortable: true},
    {field: 'itemCode', title: 'Item Code', sortable: true},
    {
        field: 'additionalData',
        title: 'Filename',
        sortable: true,
        render: (row) => (
            <div style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '20rem'}}>
                {row.additionalData?.image_filename ?? null}
            </div>
        )
    },
    {
        field: 'season',
        title: 'Season',
        align: 'center',
        sortable: true,
        render: (row) => <SeasonIcon code={row.additionalData?.season?.code}
                                     seasonAvailable={row.additionalData?.seasonAvailable}/>
    },
    {
        field: 'status',
        title: 'Status',
        align: 'center',
        render: (row) => (
            <div>
                {!row.inactiveItem && !row.status && (
                    <Badge bg="secondary">Off</Badge>
                )}
                {!row.inactiveItem && !!row.productStatus && (
                    <Badge bg="warning" className="text-dark">{row.productStatus}</Badge>)}
                {row.inactiveItem && (<Badge bg="danger">Inactive</Badge>)}
            </div>
        )
    },
    {
        field: 'colorCode',
        title: 'Swatch',
        align: 'center',
        render: (row) => (
            <div style={{height: '2rem', display: 'flex', justifyContent: 'center'}}>
                <ProductColorSwatch colorCode={row.colorCode}
                             swatchFormat={row.additionalData?.swatch_code} style={{height: '100%'}}/>
            </div>

        )
    },
    {field: 'QuantityAvailable', title: 'Available', align: 'end'},
]

export interface ProductColorTableProps {
    list: ProductColorItem[];
    onSelectItem: (item: ProductColorItem) => void;
}

export default function ProductColorTable({list, onSelectItem}: ProductColorTableProps) {
    const dispatch = useAppDispatch()
    const selected = useSelector(selectCurrentColorItem);
    const sort = useAppSelector(selectCurrentColorSort);

    const sortChangeHandler = (sort: SortProps<ProductColorItem>) => {
        dispatch(setColorsSort(sort));
    }

    return (
        <SortableTable fields={fields} keyField="id" size="sm"
                       rowClassName={(row) => classNames({'text-danger': !row.status})}
                       data={list}
                       currentSort={sort} onChangeSort={sortChangeHandler}
                       onSelectRow={(row) => onSelectItem(row)}
                       selected={row => row.id === selected?.id}
        />
    )
}
