import VariantRow from "@/components/products/variant/editor/VariantRow.tsx";
import {type ChangeEvent, useId} from "react";
import {FormCheck} from "react-bootstrap";
import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import type {ProductVariant} from "b2b-types";

export default function VariantStatusInput() {
    const id = useId();
    const {value, updateValue} = useEditorContext<ProductVariant>();

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        updateValue({title: ev.target.value});
    }

    return (
        <VariantRow label="Status" labelProps={{htmlFor: id}}>
            <FormCheck label='Enabled' id={id}
                       checked={value.status} onChange={changeHandler}
                       disabled={!value.product?.status}
                       type="checkbox" inline/>
        </VariantRow>
    )
}
