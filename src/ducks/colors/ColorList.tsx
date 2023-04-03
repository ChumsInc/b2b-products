import React from 'react';
import {useSelector} from "react-redux";
import {SortableTable, SortableTableField} from 'chums-components';
import {ProductColor} from "b2b-types";
import {setCurrentColor, setSort} from "./actions";
import {selectCurrentColor, selectSort, selectSortedList} from "./selectors";
import {useAppDispatch} from "../../app/hooks";
import ColorsPagination from "./ColorsPagination";
import ColorFilterBar from "./ColorFilterBar";
import classNames from "classnames";


const colorFields: SortableTableField<ProductColor>[] = [
    {field: 'id', title: 'ID', sortable: true, className: 'text-end'},
    {field: 'code', title: 'Color Code', sortable: true},
    {field: 'name', title: 'Color Name', sortable: true}
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
    const pagedList = useSelector(selectSortedList);
    const sort = useSelector(selectSort);

    const onSelectColor = (color: ProductColor) => {
        dispatch(setCurrentColor(color));
    }

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
            <ColorsPagination/>
        </div>
    )

}

export default React.memo(ColorList);

