import {Col, Form, FormCheck, type FormCheckProps, Row} from "react-bootstrap";
import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import type {ProductAlternateImage} from "chums-types/b2b";
import {type ChangeEvent, type RefObject, useId} from "react";

export interface ImageStatusInputProps extends FormCheckProps {
    ref?: RefObject<HTMLInputElement|null>,
}
export default function ImageStatusInput({ref, ...rest}:ImageStatusInputProps) {
    const {value, updateValue} = useEditorContext<ProductAlternateImage>();
    const id = useId();

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        updateValue({status: ev.target.checked});
    }
    return (
        <Form.Group as={Row} className="align-items-center">
            <Form.Label column={true} xs={4} htmlFor={id}>Active</Form.Label>
            <Col>
                <FormCheck type="checkbox" label="Active" id={id} {...rest}
                           checked={!!value.status} onChange={changeHandler} />
            </Col>
        </Form.Group>
    )
}
