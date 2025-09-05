import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {setCurrentImage, setImagesSort} from "@/ducks/products/images/actions";
import {SortableTable, SortableTableField, TablePagination} from "@chumsinc/sortable-tables";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {ProductAlternateImage} from "b2b-types";
import {selectImagesSort, selectSortedImages} from "@/ducks/products/images/selectors";
import {SortProps} from "chums-types";
import {imageFilter, ImageFilterProps} from "@/ducks/products/images/utils";
import classNames from "classnames";

const fields: SortableTableField<ProductAlternateImage>[] = [
    {field: "id", title: 'ID', sortable: true},
    {field: 'image', title: 'Filename', sortable: true},
    {field: 'altText', title: 'Alt Text', className: 'text-info', sortable: true},
    {field: 'status', title: 'Status', render: (img) => img.status ? 'Active' : 'Inactive'},
    {field: 'priority', title: 'Sort Order', align: 'end', sortable: true},
];

export default function ProductImageTable({search, itemCode}: ImageFilterProps) {
    const dispatch = useAppDispatch();
    const images = useSelector(selectSortedImages);
    const sort = useAppSelector(selectImagesSort);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [list, setList] = useState(imageFilter(images, {search, itemCode}));

    useEffect(() => {
        const list = imageFilter(images, {search, itemCode})
        setList(list);
        setPage(0);
    }, [images, sort, search, itemCode, rowsPerPage]);

    const sortChangeHandler = (sort: SortProps<ProductAlternateImage>) => {
        dispatch(setImagesSort(sort));
    }

    const clickHandler = (image: ProductAlternateImage) => {
        dispatch(setCurrentImage(image));
    }

    return (
        <div>
            <SortableTable size="xs" fields={fields} keyField={(img) => img.id}
                           data={list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                           rowClassName={(row) => classNames({'text-danger': !row.status})}
                           currentSort={sort} onChangeSort={sortChangeHandler}
                           onSelectRow={clickHandler}/>
            <TablePagination size="sm" page={page} onChangePage={setPage}
                             rowsPerPage={rowsPerPage} rowsPerPageProps={{onChange: setRowsPerPage}}
                             count={list.length}/>
        </div>
    )
}
