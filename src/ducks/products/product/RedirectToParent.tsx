import React from 'react';
import {useSelector} from "react-redux";
import {selectCurrentProduct} from "./selectors";
import classNames from "classnames";

import {updateProduct} from "./actions";
import {useAppDispatch} from "../../../app/hooks";

const RedirectToParent: React.FC = () => {
    const dispatch = useAppDispatch();
    const {redirectToParent, defaultParentProductsId} = useSelector(selectCurrentProduct) ?? {};
    const onChange = () => dispatch(updateProduct({redirectToParent: !redirectToParent}))
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
