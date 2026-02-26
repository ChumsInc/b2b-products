import {useAppDispatch, useAppSelector} from "@/app/configureStore.ts";
import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import type {ProductVariant} from "b2b-types";
import {selectCurrentVariantStatus} from "@/ducks/products/productVariantsSlice.ts";
import {setDefaultVariant} from "@/ducks/products/actions/variants-actions.ts";
import SpinnerButton from "@/components/common/SpinnerButton.tsx";
import Modal from "react-bootstrap/Modal";
import {useState} from "react";
import {Button} from "react-bootstrap";

export default function DefaultVariantButton() {
    const dispatch = useAppDispatch();
    const {value} = useEditorContext<ProductVariant>();
    const status = useAppSelector(selectCurrentVariantStatus);
    const [show, setShow] = useState(false);

    const clickHandler = async () => {
        if (!value.id) {
            return;
        }
        setShow(true);
    }

    const confirmHandler = async () => {
        setShow(false);
        await dispatch(setDefaultVariant(value));
    }

    return (
        <>
            <SpinnerButton type="button" size="sm" variant="outline-info"
                           onClick={clickHandler}
                           disabled={!value.id || status !== 'idle' || value.isDefaultVariant}
                           spinning={status === 'set-default'}>
                {value.isDefaultVariant && <>Default Variant</>}
                {!value.isDefaultVariant && <>Set Default Variant</>}
            </SpinnerButton>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Set Default Variant</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to set this variant as default?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={confirmHandler}>
                        Set Default
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
