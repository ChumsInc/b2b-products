import React, {useState} from "react";
import {useSelector} from "react-redux";
import {selectImages, setCurrentImage} from "./index";
import {TablePagination} from "chums-components";
import ProductImage from "../../../app/ProductImage";
import classNames from "classnames";
import {useAppDispatch} from "../../../app/hooks";
import {ProductAlternateImage} from "b2b-types";

const ProductImageList = () => {
    const dispatch = useAppDispatch();
    const images = useSelector(selectImages);
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(25);

    const clickHandler = (image: ProductAlternateImage) => {
        dispatch(setCurrentImage(image));
    }
    return (
        <div>
            <TablePagination bsSize="sm" page={page} onChangePage={setPage} rowsPerPage={rowsPerPage}
                             onChangeRowsPerPage={setRowsPerPage} count={images.length}/>
            <div className="product-image-list">
                {images.map(image => (
                    <div key={image.id} className="product-image-item" onClick={() => clickHandler(image)}>
                        <ProductImage filename={image.image}
                                      className={classNames({'text-danger': !image.status})}
                                      itemCode={image.altText} size={80}/>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ProductImageList;
