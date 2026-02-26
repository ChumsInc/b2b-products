import VariantRow from "@/components/products/variant/editor/VariantRow.tsx";
import {type ChangeEvent, useId} from "react";
import {FormControl} from "react-bootstrap";
import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import type {ProductVariant} from "b2b-types";

export default function VariantTitleInput() {
    const id = useId();
    const {value, updateValue} = useEditorContext<ProductVariant>();

    const changeHandler = (ev:ChangeEvent<HTMLInputElement>) => {
        updateValue({title: ev.target.value});
    }

    return (
        <VariantRow label="Name" labelProps={{htmlFor: id}}>
            <FormControl type="text" size="sm"
                         value={value.title} onChange={changeHandler} required/>
        </VariantRow>
    )
}
