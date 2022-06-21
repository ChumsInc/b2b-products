import React, {useEffect} from 'react';
import {useSelector} from "react-redux";

import {ConnectedPager, ConnectedTable, SortableTableField} from "chums-connected-components";

import {ProductColor} from "b2b-types";
import {colorListTableKey, defaultColorSort} from "./index";
import {loadColorsAction, setCurrentColorAction} from "./actions";
import {
    selectColorListLength,
    selectColorsLoading,
    selectCurrentColor,
    selectFilteredListLength,
    selectSortedList
} from "./selectors";
import {useAppDispatch} from "../../app/hooks";


interface ColorTableField extends SortableTableField {
    field: keyof ProductColor,
}

const colorFields: ColorTableField[] = [
    {field: 'id', title: 'ID', sortable: true, className: 'text-end'},
    {field: 'code', title: 'Color Code', sortable: true},
    {field: 'name', title: 'Color Name', sortable: true}
];

const rowClassName = (row: ProductColor) => {
    return {
        'text-danger': row.active === false,
        'text-warning': row.active === null,
    }
}


const ColorList: React.FC = () => {
    const dispatch = useAppDispatch();
    const count = useSelector(selectColorListLength);
    const countFiltered = useSelector(selectFilteredListLength);
    const loading = useSelector(selectColorsLoading);
    const selected = useSelector(selectCurrentColor);
    const pagedList = useSelector(selectSortedList);

    useEffect(() => {
        if (!count && !loading) {
            dispatch(loadColorsAction());
        }
    }, []);

    const onSelectColor = (color: ProductColor) => {
        dispatch(setCurrentColorAction(color));
    }

    return (
        <div>
            <ConnectedTable tableKey={colorListTableKey} defaultSort={defaultColorSort} keyField={'id'}
                            fields={colorFields} size="xs"
                            selected={(color) => color.id === selected.id} rowClassName={rowClassName}
                            onSelectRow={onSelectColor}
                            data={pagedList}/>
            <ConnectedPager pageSetKey={colorListTableKey} dataLength={countFiltered}
                            filtered={count !== countFiltered}/>
        </div>
    )

}

export default React.memo(ColorList);

