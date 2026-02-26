import VariantRow from "@/components/products/variant/editor/VariantRow.tsx";
import {useId} from "react";
import {FormControl} from "react-bootstrap";
import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import type {ProductVariant} from "b2b-types";

export default function VariantIdInput() {
    const id = useId();
    const {value} = useEditorContext<ProductVariant>()

    return (
        <VariantRow label="ID" labelProps={{htmlFor: id}}>
            <FormControl type="number" readOnly id={id} size="sm"
                         value={value.id}/>
        </VariantRow>
    )
}
