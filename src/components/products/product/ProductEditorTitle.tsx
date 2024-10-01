import React from 'react';
import classNames from "classnames";
import {Spinner} from "chums-components";
import {useSelector} from "react-redux";
import {
    selectCurrentProduct,
    selectCurrentProductChanged,
    selectCurrentProductLoading
} from "../../../ducks/products/product/selectors";

const ProductEditorTitle: React.FC = () => {
    const product = useSelector(selectCurrentProduct);
    const loading = useSelector(selectCurrentProductLoading);
    const changed = useSelector(selectCurrentProductChanged);

    return (
        <div className="row g-1 align-items-center">
            <h2 className={classNames('col-auto me-3', {'text-warning': changed})}>
                {product?.name || 'Product Editor'}
            </h2>
            {product?.additionalData?.subtitle && (
                <div className=" col-auto me-3 text-muted"><span>{product.additionalData.subtitle ?? null}</span></div>
            )}
            <div className="col">
                {changed && <span className="text-warning  bi-exclamation-triangle-fill ms-1"/>}
                {loading && <Spinner className="ms-3" color="primary" type="border" bsSize="sm"/>}
            </div>
        </div>
    )
}

export default ProductEditorTitle;
