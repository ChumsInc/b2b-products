import React, {useState} from 'react';
import {useAppDispatch} from "../../../app/hooks";
import {useSelector} from "react-redux";
import {selectImages} from "./index";
import ProductImageList from "./ProductImageList";
import ProductImageEdit from "./ProductImageEdit";

const ProductImagesTab = () => {
    const dispatch = useAppDispatch();
    const images = useSelector(selectImages);
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(25);

    return (
        <div>
            <ProductImageEdit />
            <ProductImageList/>
        </div>
    )
}
export default ProductImagesTab;
