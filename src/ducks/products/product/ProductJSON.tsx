import React from "react";
import {useSelector} from "react-redux";
import {selectCurrentProduct} from "./selectors";
import {JSONView} from "@chumsinc/json-view";

const theme = {
    scheme: 'monokai',
    author: 'wimer hazenberg (http://www.monokai.nl)',
    base00: '#272822',
    base01: '#383830',
    base02: '#49483e',
    base03: '#75715e',
    base04: '#a59f85',
    base05: '#f8f8f2',
    base06: '#f5f4f1',
    base07: '#f9f8f5',
    base08: '#f92672',
    base09: '#fd971f',
    base0A: '#f4bf75',
    base0B: '#a6e22e',
    base0C: '#a1efe4',
    base0D: '#66d9ef',
    base0E: '#ae81ff',
    base0F: '#cc6633',
};
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
