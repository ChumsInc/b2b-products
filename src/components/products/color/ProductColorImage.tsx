import {useId, useState} from 'react';
import {selectCurrentColorItem} from "@/ducks/products/productColorItemsSlice";
import classNames from "classnames";
import ProductImage from "../../app/ProductImage";
import {selectCurrentProduct} from "@/ducks/products/productSlice.ts";
import SeasonAlert from "../../season/SeasonAlert";
import {Alert, FormCheck} from "react-bootstrap";
import {useAppSelector} from "@/app/configureStore.ts";

const ProductColorImage = () => {
    const current = useAppSelector(selectCurrentColorItem);
    const product = useAppSelector(selectCurrentProduct);
    const [showImage, setShowImage] = useState(true);
    const idShowImage = useId();
    const idShowJSON = useId();

    if (!current) {
        return null;
    }

    return (
        <div>
            {showImage && (
                <div className="text-center">
                    <ProductImage filename={current.additionalData?.image_filename || product?.image || 'missing.png'}
                                  className={classNames('m-auto', {'text-danger': !current.status})}
                                  colorCode={current.colorCode} itemCode={current.itemCode} size={250}/>
                    {!!current.id && current.productType === null &&
                        <Alert variant="danger">Item <strong>{current.itemCode}</strong> does not exist.</Alert>}
                    {current.additionalData?.season?.code &&
                        <SeasonAlert code={current.additionalData?.season?.code}/>}
                </div>
            )}
            {!showImage && (
                <div className="font-monospace" style={{maxHeight: '350px', overflow: 'auto'}}>
                    <code>
                        <pre>
                            {JSON.stringify(current, null, 2)}
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
