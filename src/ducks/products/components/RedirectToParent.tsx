import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {selectCurrentProduct} from "../selectors";
import {updateProductAction} from "../actions";
import classNames from "classnames";

const RedirectToParent:React.FC = () => {
    const dispatch = useDispatch();
    const {redirectToParent, defaultParentProductsId} = useSelector(selectCurrentProduct);
    const onChange = () => dispatch(updateProductAction({redirectToParent: !redirectToParent}))
    const iconClassName = {
        'bi-arrow-up-right-square-fill': redirectToParent,
        'bi-arrow-up-right-square': !redirectToParent,
    }

    return (
        <div className="input-group-text" title="Redirect to parent">
            <input type="checkbox" className="form-check-input mt-0 me-1"
                   disabled={defaultParentProductsId === 0}
                   id="product-main--redirectToParent"
                   checked={redirectToParent}
                   onChange={onChange}/>
            <label htmlFor="product-main--redirectToParent">
                <span className={classNames('me-1', iconClassName)}/>301
            </label>
        </div>
    )
}
export default RedirectToParent;
