import {startTransition, useEffect, useState} from "react";
import {TablePagination} from "@chumsinc/sortable-tables";
import type {ProductAlternateImage} from "chums-types/b2b";
import {Card, Col, Row} from "react-bootstrap";
import {productAltImageSrc} from "@/ducks/products/utils/images-utils.ts";
import {useProductImages} from "@/components/products/images/useProductImages.ts";
import ImageFilename from "@/components/products/images/image-list/ImageFilename.tsx";

export interface ProductImageListProps {
    images: ProductAlternateImage[];
}

export default function ProductImageGrid({images}: ProductImageListProps) {
    const {currentImage, setCurrentImage} = useProductImages();
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(25);


    useEffect(() => {
        startTransition(() => {
            setPage(0);
        })
    }, [images.length]);

    const clickHandler = (image: ProductAlternateImage) => {
        setCurrentImage(image);
    }
    return (
        <div>
            <TablePagination size="sm" page={page} onChangePage={setPage}
                             rowsPerPage={rowsPerPage}
                             rowsPerPageProps={{onChange: setRowsPerPage, label: 'Per Page'}}
                             count={images.length}/>
            <Row className="g-3 mt-1">
                {images
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(image => (
                        <Col key={image.id} xs={6} sm={4} lg={3}>
                            <Card onClick={() => clickHandler(image)}
                                  border={currentImage.id === image.id ? 'primary' : 'secondary'}
                                  style={{width: '100%', maxWidth: '100%'}}>
                                <Card.Img variant="top" src={productAltImageSrc(image, '250')} alt={image.altText}/>
                                {currentImage.id === image.id && (
                                    <Card.ImgOverlay>
                                        <span className="bi-check-lg text-primary"/>
                                    </Card.ImgOverlay>
                                )}
                                <Card.Body className="text-center border-top">
                                    <Card.Text as="div">
                                        <ImageFilename title={image.image}>{image.image}</ImageFilename>
                                    </Card.Text>
                                    <Card.Text className="text-wrap text-secondary">{image.altText}</Card.Text>
                                </Card.Body>
                            </Card>

                        </Col>
                    ))}
            </Row>
        </div>
    )
}

