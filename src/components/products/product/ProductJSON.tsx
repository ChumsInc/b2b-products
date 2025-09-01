import React from "react";
import {useSelector} from "react-redux";
import {selectCurrentProduct} from "../../../ducks/products/product/selectors";
import {JSONView} from "@chumsinc/json-view";

const ProductJSON: React.FC = () => {
    const product = useSelector(selectCurrentProduct)

    const style = {
        fontSize: '0.7rem',
        lineHeight: '0.85rem',
        maxHeight: '90vh',
        overflow: 'auto',
        fontFamily: 'Roboto Mono, monospace'
    }
    return (
        <div style={style}>
            <JSONView data={product}/>
        </div>
    )
}
export default ProductJSON;
