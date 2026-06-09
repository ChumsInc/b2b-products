import {useEffect, useState} from "react";
import {selectImagesSort, setImagesSort} from "@/ducks/products/productImagesSlice.ts";
import {SortableTable, type SortableTableField, TablePagination} from "@chumsinc/sortable-tables";
import {useAppDispatch, useAppSelector} from "@/app/configureStore.ts";
import type {ProductAlternateImage} from "chums-types/b2b";
import type {SortProps} from "chums-types";
import classNames from "classnames";
import {useProductImages} from "@/components/products/images/useProductImages.ts";

const fields: SortableTableField<ProductAlternateImage>[] = [
    {field: "id", title: 'ID', sortable: true},
    {field: 'image', title: 'Filename', sortable: true},
    {field: 'altText', title: 'Alt Text', className: 'text-info', sortable: true},
    {field: 'status', title: 'Status', render: (img) => img.status ? 'Active' : 'Inactive'},
    {field: 'priority', title: 'Sort Order', align: 'end', sortable: true},
];

export interface ProductImageListProps {
    images: ProductAlternateImage[];
}

export default function ProductImageTable({images}: ProductImageListProps) {
    const {setCurrentImage, currentImage} = useProductImages();
    const dispatch = useAppDispatch();
    const sort = useAppSelector(selectImagesSort);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);

    useEffect(() => {
        Promise.resolve().then(() => {
            setPage(0);
        })
    }, [images.length, sort, rowsPerPage]);

    const sortChangeHandler = (sort: SortProps<ProductAlternateImage>) => {
        dispatch(setImagesSort(sort));
    }

    const clickHandler = (image: ProductAlternateImage) => {
        setCurrentImage(image);
    }

    return (
        <div>
            <SortableTable size="xs" fields={fields} keyField={(img) => img.id}
                           data={images.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                           rowClassName={(row) => classNames({'text-danger': !row.status})}
                           currentSort={sort} onChangeSort={sortChangeHandler}
                           onSelectRow={clickHandler} selected={(row) => row.id === currentImage?.id}/>
            <TablePagination size="sm" page={page} onChangePage={setPage}
                             rowsPerPage={rowsPerPage} rowsPerPageProps={{onChange: setRowsPerPage}}
                             count={images.length}/>
        </div>
    )
}
