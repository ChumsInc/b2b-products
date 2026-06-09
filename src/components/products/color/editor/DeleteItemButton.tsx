import {Button} from "react-bootstrap";
import {useAppDispatch, useAppSelector} from "@/app/configureStore.ts";
import {selectCurrentProductId} from "@/ducks/products/productSlice.ts";
import {selectCurrentColorStatus} from "@/ducks/products/productColorItemsSlice.ts";
import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import type {ProductColorItem} from "chums-types/b2b";
import {newItem} from "@/components/products/color/utils.ts";
import {useState} from "react";
import Modal from "react-bootstrap/Modal";
import useProductItems from "@/components/products/color/useProductItems.ts";
import {removeColorItem} from "@/ducks/products/actions/color-item-actions.ts";

export default function DeleteItemButton() {
    const dispatch = useAppDispatch();
    const productId = useAppSelector(selectCurrentProductId);
    const status = useAppSelector(selectCurrentColorStatus);
    const {changed} = useEditorContext<ProductColorItem>();
    const {setCurrentItem, currentItem} = useProductItems();
    const [show, setShow] = useState(false);

    const removeItemHandler = async () => {
        if (!show) {
            setShow(true);
            return;
        }
        setShow(false)
        await dispatch(removeColorItem(currentItem));
        setCurrentItem(newItem(productId));
    }
    return (
        <>
            <Button type="button" variant="outline-danger" size="sm"
                    disabled={!productId || !currentItem.id || status !== 'idle' || changed} onClick={removeItemHandler}>
                Delete Item
            </Button>
            {show && (
                <Modal show={show} onHide={() => setShow(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Item</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete this item? This cannot be undone.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" size="sm" onClick={() => setShow(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" size="sm" onClick={removeItemHandler}>
                            Delete Item
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </>
    )
}
