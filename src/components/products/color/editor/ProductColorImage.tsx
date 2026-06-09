import {useId, useState} from 'react';
import classNames from "classnames";
import ProductImage from "../../../app/ProductImage.tsx";
import {selectCurrentProduct} from "@/ducks/products/productSlice.ts";
import SeasonAlert from "../../../season/SeasonAlert.tsx";
import {Alert, Card, FormCheck} from "react-bootstrap";
import {useAppSelector} from "@/app/configureStore.ts";
import {productImagePath} from "@/utils/image-utils.ts";
import useProductItems from "@/components/products/color/useProductItems.ts";

const ProductColorImage = () => {
    const {currentItem} = useProductItems();
    const product = useAppSelector(selectCurrentProduct);
    const [showImage, setShowImage] = useState(true);
    const idShowImage = useId();
    const idShowJSON = useId();

    if (!currentItem) {
        return (
            <Card>
                <Card.Img variant="top" src={productImagePath('missing-placeholder2.jpg')} alt="Missing Image"/>
                <Card.Body>
                    <Card.Title>No Color Selected</Card.Title>
                    <Card.Text>
                        Select a color from the list to view the image.
                    </Card.Text>
                </Card.Body>
            </Card>
        );
    }

    return (
        <div>
            {showImage && (
                <div className="text-center">
                    <ProductImage
                        filename={currentItem.additionalData?.image_filename || product?.image || 'missing.png'}
                        className={classNames('m-auto', {'text-danger': !currentItem.status})}
                        colorCode={currentItem.colorCode} itemCode={currentItem.itemCode} size={250}/>
                    {!!currentItem.id && currentItem.productType === null &&
                        <Alert variant="danger">Item <strong>{currentItem.itemCode}</strong> does not exist.</Alert>}
                    {currentItem.additionalData?.season?.code &&
                        <SeasonAlert code={currentItem.additionalData?.season?.code}/>}
                </div>
            )}
            {!showImage && (
                <div className="font-monospace" style={{maxHeight: '350px', overflow: 'auto'}}>
                    <code>
                        <pre>
                            {JSON.stringify(currentItem, null, 2)}
                        </pre>
                    </code>
                </div>
            )}
            <div className="mt-1">
                <FormCheck type="radio" value={0} name="show-image" inline
                           checked={showImage} onChange={(ev) => setShowImage(ev.target.checked)}
                           label="Show Image" id={idShowImage}/>
                <FormCheck type="radio" value={1} name="show-image" inline
                           checked={!showImage} onChange={(ev) => setShowImage(!ev.target.checked)}
                           label="Show Data" id={idShowJSON}/>
            </div>
        </div>
    )
}
export default ProductColorImage;
