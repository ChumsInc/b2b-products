import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {selectCurrentMix, selectCurrentMixComponents} from "../../../ducks/products/mix/selectors";
import {ProductMixComponent} from "b2b-types/src/products";
import ProductMixComponentRow from "./ProductMixComponentRow";
import BOMDetail from "./BOMDetail";
import {defaultMixComponent} from "../../../ducks/products/mix/utils";
import {Button, Col, Row} from "react-bootstrap";
import MixComponentEditor from "@/components/products/mix/MixComponentEditor";


const ProductMixComponents = () => {
    const mix = useSelector(selectCurrentMix);
    const components = useSelector(selectCurrentMixComponents);
    const [editorOpen, setEditorOpen] = useState(false);
    const [component, setComponent] = useState<ProductMixComponent>({
        ...defaultMixComponent,
        mixID: mix?.id ?? 0
    });

    useEffect(() => {
        setComponent({...defaultMixComponent, mixID: mix?.id ?? 0});
    }, [mix?.id])


    const newComponentClickHandler = () => {
        setComponent({...defaultMixComponent, mixID: mix?.id ?? 0});
        setEditorOpen(true);
    }

    return (
        <div>
            <Row className="justify-content-end">
                <Col>
                    <h4>Components</h4>
                </Col>
                <Col xs="auto">
                    <Button variant="primary" size="sm" onClick={newComponentClickHandler}>
                        New Component
                    </Button>
                </Col>
            </Row>
            <table className="table table-sm">
                <thead>
                <tr>
                    <th>Item Code</th>
                    <th>Color Code</th>
                    <th>Color Desc</th>
                    <th className="text-end">Quantity</th>
                    <th className="text-center">Update</th>
                </tr>
                </thead>
                <tbody>
                {components.map(comp => (
                    <ProductMixComponentRow key={comp.id} productId={mix?.productId ?? 0} component={comp}/>
                ))}
                </tbody>
                <tfoot>
                <tr>
                    <th colSpan={3}>Total</th>
                    <th className="text-end">
                        {components.reduce((total, comp) => total + (comp?.itemQuantity || 0), 0)}
                    </th>
                    <th></th>
                </tr>
                </tfoot>
            </table>
            <MixComponentEditor mix={mix} value={component} show={editorOpen} onClose={() => setEditorOpen(false)}/>

        </div>
    )
}

export default ProductMixComponents;
