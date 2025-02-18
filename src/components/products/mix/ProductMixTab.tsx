import React, {useId} from 'react';
import ProductMixEditor from "./ProductMixEditor";
import ProductMixComponents from "./ProductMixComponents";
import {Tab, Tabs} from "react-bootstrap";
import BOMDetail from "@/components/products/mix/BOMDetail";

const ProductMixTab: React.FC = () => {
    const id = useId();

    return (
        <div>
            <ProductMixEditor/>
            <Tabs defaultActiveKey="items" id={id} className="mb-1">
                <Tab eventKey="items" title="Components">
                    <ProductMixComponents/>
                </Tab>
                <Tab eventKey="bom" title="Bill of Materials">
                    <BOMDetail/>
                </Tab>
            </Tabs>
        </div>
    )
}

export default ProductMixTab;
