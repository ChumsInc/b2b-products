import {Button} from "react-bootstrap";
import {useAppSelector} from "@/app/configureStore.ts";
import {selectCurrentProductId} from "@/ducks/products/productSlice.ts";
import {selectCurrentColorStatus} from "@/ducks/products/productColorItemsSlice.ts";
import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import type {ProductColorItem} from "chums-types/b2b";
import {newItem} from "@/components/products/color/utils.ts";
import {useState} from "react";
import Modal from "react-bootstrap/Modal";
import useProductItems from "@/components/products/color/useProductItems.ts";

export default function NewItemButton() {
    const productId = useAppSelector(selectCurrentProductId);
    const status = useAppSelector(selectCurrentColorStatus);
    const {changed} = useEditorContext<ProductColorItem>();
    const {setCurrentItem} = useProductItems();
    const [show, setShow] = useState(false);

    const newItemHandler = () => {
        if (changed && !show) {
            setShow(true);
            return;
        }
        setShow(false)
        setCurrentItem(newItem(productId));
    }
    return (
        <>
            <Button type="button" variant="outline-secondary" size="sm"
                    disabled={!productId || status !== 'idle'} onClick={newItemHandler}>
                New Item
            </Button>
            {show && (
                <Modal show={show} onHide={() => setShow(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>New Item</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to discard your changes?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" size="sm" onClick={() => setShow(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" size="sm" onClick={newItemHandler}>
                            Create New Item
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </>
    )
}
