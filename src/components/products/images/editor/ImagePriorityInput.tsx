import {Col, Form, type FormControlProps, Row} from "react-bootstrap";
import {useEditorContext} from "@/hooks/editor/useEditorContext.ts";
import type {ProductAlternateImage} from "chums-types/b2b";
import {type ChangeEvent, type RefObject, useId} from "react";

export interface ImagePriorityInputProps extends FormControlProps {
    ref?: RefObject<HTMLInputElement|null>,
}
export default function ImagePriorityInput({ref, ...rest}:ImagePriorityInputProps) {
    const {value, updateValue} = useEditorContext<ProductAlternateImage>();
    const id = useId();

    const changeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        updateValue({priority: +ev.target.value});
    }
    return (
        <Form.Group as={Row}>
            <Form.Label column={true} xs={4} htmlFor={id}>Priority</Form.Label>
            <Col>
                <Form.Control type="number" id={id} size="sm" step={1} min={0} className="text-end"
                              ref={ref} {...rest}
                              value={value.priority} onChange={changeHandler}/>
            </Col>
        </Form.Group>
    )
}
