import {useAppDispatch} from "@/app/configureStore.ts";
import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import type {ProductVariant} from "b2b-types";
import {setCurrentVariant} from "@/ducks/products/productVariantsSlice.ts";
import {Button} from "react-bootstrap";

export interface NewVariantButtonProps {
    productId: number | null,
}

export default function NewVariantButton({productId}: NewVariantButtonProps) {
    const dispatch = useAppDispatch();
    const {changed, value, reset} = useEditorContext<ProductVariant>();

    const newVariantHandler = () => {
        if (!productId) {
            return;
        }
        if (!changed || window.confirm('Are you sure you want to discard your changes?')) {
            if (!value.id) {
                reset();
                return;
            }
            dispatch(setCurrentVariant(null))
        }
    }

    return (
        <Button type="button" size="sm" variant="outline-secondary"
                onClick={newVariantHandler}
                disabled={!productId}>
            New
        </Button>
    )
}
