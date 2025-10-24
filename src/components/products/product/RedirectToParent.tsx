import React from 'react';
import {selectCurrentProduct, updateProduct} from "@/ducks/products/productSlice.ts";
import classNames from "classnames";
import {useAppDispatch, useAppSelector} from "@/app/configureStore";

const RedirectToParent: React.FC = () => {
    const dispatch = useAppDispatch();
    const product = useAppSelector(selectCurrentProduct);
    const onChange = () => dispatch(updateProduct({redirectToParent: !product?.redirectToParent}))
    const iconClassName = {
        'bi-arrow-up-right-square-fill': product?.redirectToParent,
        'bi-arrow-up-right-square': !product?.redirectToParent,
    }

    return (
        <div className="input-group-text" title="Redirect to parent">
            <input type="checkbox" className="form-check-input mt-0 me-1"
                   disabled={product?.defaultParentProductsId === 0}
                   id="product-main--redirectToParent"
                   checked={product?.redirectToParent}
                   onChange={onChange}/>
            <label htmlFor="product-main--redirectToParent">
                <span className={classNames('me-1', iconClassName)}/>301
            </label>
        </div>
    )
}
export default RedirectToParent;
