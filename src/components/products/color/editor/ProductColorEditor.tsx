import {useRef} from 'react';
import {selectCurrentProductId} from "@/ducks/products/productSlice.ts";
import type {ProductColorItem} from "chums-types/b2b";
import {saveCurrentColorItem} from "@/ducks/products/actions/color-item-actions.ts";
import {useAppDispatch, useAppSelector} from "@/app/configureStore.ts";
import {Alert, Col, Collapse, Form, Row} from "react-bootstrap";
import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import ItemCodeInput from "@/components/products/color/editor/ItemCodeInput.tsx";
import ColorCodeInput from "@/components/products/color/editor/ColorCodeInput.tsx";
import ItemFilename from "@/components/products/color/editor/ItemFilename.tsx";
import styles from './styles.module.css';
import ItemStatus from './ItemStatus.tsx';
import ItemSeason from "@/components/products/color/editor/ItemSeason.tsx";
import ItemMessage from "@/components/products/color/editor/ItemMessage.tsx";
import ItemSaveButton from "@/components/products/color/editor/ItemSaveButton.tsx";
import NewItemButton from "@/components/products/color/editor/NewItemButton.tsx";
import DeleteItemButton from "@/components/products/color/editor/DeleteItemButton.tsx";
import {newItem} from "@/components/products/color/utils.ts";
import useProductItems from "@/components/products/color/useProductItems.ts";

const ProductColorEditor = () => {
    const dispatch = useAppDispatch();
    const {value, changed} = useEditorContext<ProductColorItem>();
    const {setCurrentItem} = useProductItems();
    const itemCodeRef = useRef<HTMLInputElement>(null)
    const productId = useAppSelector(selectCurrentProductId);

    const submitHandler = async () => {
        await dispatch(saveCurrentColorItem({...value, productId}));
        setCurrentItem(newItem(productId));
    }


    return (
        <Form action={submitHandler} className={styles.productColorEditor}>
            <ItemCodeInput ref={itemCodeRef}/>
            <ColorCodeInput/>
            <ItemFilename/>
            <ItemStatus/>
            <ItemMessage/>
            <ItemSeason/>
            <Collapse in={changed}>
                <div>
                    <Alert variant="warning">Don't forget to save your changes.</Alert>
                </div>
            </Collapse>
            <Row className="g-1 justify-content-end">
                <Col xs="auto">
                    <ItemSaveButton/>
                </Col>
                <Col xs="auto">
                    <NewItemButton/>
                </Col>
                <Col xs="auto">
                    <DeleteItemButton/>
                </Col>
            </Row>
        </Form>
    )
}

export default ProductColorEditor;
