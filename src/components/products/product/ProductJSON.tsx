import React from "react";
import {selectCurrentProduct} from "@/ducks/products/productSlice.ts";
import {JSONView} from "@chumsinc/json-view";
import {useAppSelector} from "@/app/configureStore.ts";
import {useBootstrapTheme} from "@/components/app/useBootstrapTheme.ts";

const ProductJSON: React.FC = () => {
    const product = useAppSelector(selectCurrentProduct)
    const bsTheme = useBootstrapTheme();

    const style = {
        fontSize: '0.7rem',
        lineHeight: '0.85rem',
        maxHeight: '90vh',
        overflow: 'auto',
        fontFamily: 'Roboto Mono, monospace'
    }
    return (
        <div style={style}>
            <JSONView data={product} dark={bsTheme === 'dark'} defaultOpenLevels={1} />
        </div>
    )
}
export default ProductJSON;
