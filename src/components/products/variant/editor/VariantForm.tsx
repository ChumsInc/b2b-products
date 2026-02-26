import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import type {ProductVariant} from "b2b-types";
import {Alert, Button, Form, ProgressBar} from "react-bootstrap";
import {type FormEvent, useState} from "react";
import {saveCurrentVariant} from "@/ducks/products/actions/variants-actions.ts";
import {useAppDispatch, useAppSelector} from "@/app/configureStore.ts";
import {selectCurrentProductId} from "@/ducks/products/productSlice.ts";
import NewVariantButton from "@/components/products/variant/editor/NewVariantButton.tsx";
import DeleteVariantButton from "@/components/products/variant/editor/DeleteVariantButton.tsx";
import {selectCurrentVariantStatus} from "@/ducks/products/productVariantsSlice.ts";
import DefaultVariantButton from "@/components/products/variant/editor/DefaultVariantButton.tsx";
import VariantIdInput from "@/components/products/variant/editor/VariantIdInput.tsx";
import VariantKeywordSelect from "@/components/products/variant/editor/VariantKeywordSelect.tsx";
import VariantTitleInput from "@/components/products/variant/editor/VariantTitleInput.tsx";
import VariantStatusInput from "@/components/products/variant/editor/VariantStatusInput.tsx";

export default function VariantForm() {
    const dispatch = useAppDispatch();
    const productId = useAppSelector(selectCurrentProductId);
    const status = useAppSelector(selectCurrentVariantStatus);
    const {value, changed} = useEditorContext<ProductVariant>();
    const [alert, setAlert] = useState<string | null>(null);

    const submitHandler = async (ev: FormEvent) => {
        ev.preventDefault();
        await dispatch(saveCurrentVariant(value));
    }

    return (
        <Form onSubmit={submitHandler}>
            <VariantIdInput/>
            <VariantKeywordSelect onAlert={setAlert}/>
            <VariantTitleInput/>
            <VariantStatusInput/>
            <div className="d-flex justify-content-end gap-3 mb-1">
                <Button type="submit" variant="primary" size="sm"
                        disabled={!!alert || !productId || status !== 'idle'}>
                    Save
                </Button>
                <NewVariantButton productId={productId}/>
                <DeleteVariantButton/>
                <DefaultVariantButton/>
            </div>
            {status !== 'idle' && (<ProgressBar now={100} animated striped label={status}/>)}
            {changed && <Alert color="warning">Don&#39;t forget to save your changes.</Alert>}
        </Form>
    )
}
