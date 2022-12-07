import React from 'react';
import classNames from "classnames";
import {Spinner} from "chums-components";
import {useSelector} from "react-redux";
import {selectCurrentProductChanged, selectCurrentProductLoading} from "./selectors";
import {selectCurrentProductStatus} from "./selectors";

const ProductEditorTitle: React.FC = () => {
    const loading = useSelector(selectCurrentProductLoading);
    const changed = useSelector(selectCurrentProductChanged);
    const status = useSelector(selectCurrentProductStatus);

    return (
        <h2>
            <span className={classNames('me-3', {'text-warning': changed})}>Product Editor</span>
            <small>
                <span className={classNames({
                    "bi-toggle2-on": status,
                    'bi-toggle2-off': !status,
                    'text-danger': !status
                })}/>
                {changed && <span className="text-warning  bi-exclamation-triangle-fill ms-1"/>}
                {loading && <Spinner className="ms-3" color="primary" type="border"/>}
            </small>
        </h2>
    )
}

export default ProductEditorTitle;
