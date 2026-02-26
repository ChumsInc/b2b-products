import {useAppDispatch, useAppSelector} from "@/app/configureStore.ts";
import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import type {ProductVariant} from "b2b-types";
import {selectCurrentVariantStatus} from "@/ducks/products/productVariantsSlice.ts";
import {removeVariant} from "@/ducks/products/actions/variants-actions.ts";
import SpinnerButton from "@/components/common/SpinnerButton.tsx";

export default function DeleteVariantButton() {
    const dispatch = useAppDispatch();
    const {value} = useEditorContext<ProductVariant>();
    const status = useAppSelector(selectCurrentVariantStatus);

    const deleteVariantHandler = async () => {
        if (!value.id) {
            return;
        }
        if (window.confirm('Are you sure you want to delete this productVariants?')) {
            await dispatch(removeVariant(value));
        }
    }

    return (
        <SpinnerButton type="button" size="sm" variant="outline-danger"
                       onClick={deleteVariantHandler}
                       disabled={!value.id} spinning={status === 'deleting'}>
            Delete
        </SpinnerButton>
    )
}
