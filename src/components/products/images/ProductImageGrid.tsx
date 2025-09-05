import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {setCurrentImage} from "../../../ducks/products/images/actions";
import {TablePagination} from "@chumsinc/sortable-tables";
import {useAppDispatch} from "../../app/hooks";
import {ProductAlternateImage} from "b2b-types";
import {selectSortedImages} from "../../../ducks/products/images/selectors";
import {Card, Col, Row} from "react-bootstrap";
import ResponsiveProductImage from "@/components/common/ResponsiveProductImage";
import {imageFilter, ImageFilterProps, productAltImageSrc} from "@/ducks/products/images/utils";

export default function ProductImageGrid({search, itemCode}: ImageFilterProps) {
    const dispatch = useAppDispatch();
    const images = useSelector(selectSortedImages);
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [list, setList] = useState(images);

    useEffect(() => {
        const list = imageFilter(images, {search, itemCode});
        setList(list);
        setPage(0);
    }, [images, search, itemCode, rowsPerPage]);

    const clickHandler = (image: ProductAlternateImage) => {
        dispatch(setCurrentImage(image));
    }
    return (
        <div>
            <TablePagination size="sm" page={page} onChangePage={setPage}
                             rowsPerPage={rowsPerPage}
                             rowsPerPageProps={{onChange: setRowsPerPage, label: 'Per Page'}}
                             count={list.length}/>
            <Row className="g-3 mt-1">
                {list
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(image => (
                        <Col key={image.id} xs={6} sm={4} lg={3}>
                            <Card onClick={() => clickHandler(image)} style={{width: '100%', maxWidth: '100%'}}>
                                <Card.Body className="text-center">
                                    <span className="text-wrap text-secondary">{image.altText}</span>
                                </Card.Body>
                                <Card.Img variant="bottom" src={productAltImageSrc(image, '250')} alt={image.altText}/>
                            </Card>

                        </Col>
                    ))}
            </Row>
        </div>
    )
}

