import classNames from "classnames";
import Spinner from "react-bootstrap/esm/Spinner";
import {Button} from "react-bootstrap";
import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import type {ProductColorItem} from "chums-types/b2b";
import {useAppSelector} from "@/app/configureStore.ts";
import {selectCurrentProductId} from "@/ducks/products/productSlice.ts";
import {selectCurrentColorStatus} from "@/ducks/products/productColorItemsSlice.ts";

export default function ItemSaveButton() {
    const productId = useAppSelector(selectCurrentProductId);
    const status = useAppSelector(selectCurrentColorStatus);
    const {changed} = useEditorContext<ProductColorItem>();
    return (
        <Button type="submit"
                className={classNames("btn btn-sm", {
                    'me-1': status === 'saving',
                    'btn-primary': !changed,
                    'btn-warning': changed
                })}
                disabled={!productId || status !== 'idle'}>
            {status === 'saving' && (
                <Spinner animation="border" variant="primary" size="sm" role="status" aria-hidden/>
            )}
            {changed && (
                <span className="bi-exclamation-triangle-fill me-1"/>
            )}
            Save
        </Button>
    )
}
